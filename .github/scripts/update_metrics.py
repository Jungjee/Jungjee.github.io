#!/usr/bin/env python3
"""Update the metrics band in site/index.html from Google Scholar + the CV.

Usage:
    update_metrics.py                 # fetch Scholar live
    update_metrics.py <saved.html>    # parse a saved profile page (for testing)

Citations / h-index / i10-index come from the Google Scholar profile;
Publications comes from the CV's "Publications (... N publications ...)" heading.

Google Scholar answers residential IPs but serves a 1 KB "We're sorry..." stub
to datacenter ranges, which is exactly where CI runs. So the profile page is
fetched through a chain of sources and the first one that yields a parseable
stats table wins; if none does, the run fails loudly rather than writing
anything.

Guards (any violation exits 1 without touching the file, so a bot-check page
can never blank or corrupt the metrics band):
  * every value must parse as a positive int
  * no metric may decrease
  * no metric may more than double in one week

Writes `changed` and `summary` to $GITHUB_OUTPUT when running under Actions.
"""

import os
import re
import subprocess
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SITE = ROOT / "site" / "index.html"
CV = ROOT / "CV_Jee-weon_Jung.pdf"

SCHOLAR_URL = "https://scholar.google.com/citations?user=A5OcLdAAAAAJ&hl=en"


def _proxied(template):
    return template.format(url=urllib.parse.quote(SCHOLAR_URL, safe=""))


# Tried in order, then the whole list is retried; first parseable page wins.
# Scholar's datacenter block is intermittent — a direct fetch from an Actions
# runner has both succeeded and 403'd minutes apart — so retrying is the main
# lever. The proxies are best-effort: AllOrigins has returned the real page but
# also 522'd, and codetabs is included only as another roll of the dice.
SOURCES = [
    ("direct", SCHOLAR_URL),
    ("allorigins", _proxied("https://api.allorigins.win/raw?url={url}")),
    ("codetabs", _proxied("https://api.codetabs.com/v1/proxy?quest={url}")),
]

ROUNDS = 5           # passes over SOURCES
ROUND_SLEEP = 45     # seconds between passes (~3 min worst case)

UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36")

# Order of the four tiles in the metrics band.
LABELS = ["Publications", "Citations", "h-index", "i10-index"]

TILE_RE = re.compile(
    r'(<span class="mv" data-count=")(\d+)("[^>]*>)([\d,]+)(</span>'
    r'<span class="ml">)([^<]+)(</span>)'
)


def fail(msg):
    print(f"::error::{msg}")
    sys.exit(1)


def fetch(url):
    req = urllib.request.Request(url, headers={
        "User-Agent": UA,
        "Accept-Language": "en-US,en;q=0.9",
    })
    with urllib.request.urlopen(req, timeout=60) as resp:
        return resp.read().decode("utf-8", errors="replace")


def parse_stats(html):
    """Return {'Citations','h-index','i10-index'} or None if the page is a stub.

    The stats table renders six `gsc_rsb_std` cells in the order
    Citations(all), Citations(since), h(all), h(since), i10(all), i10(since).
    """
    nums = [int(n) for n in re.findall(r'gsc_rsb_std">(\d+)<', html)]
    if len(nums) < 6:
        return None
    return {"Citations": nums[0], "h-index": nums[2], "i10-index": nums[4]}


def scholar_metrics(saved=None):
    if saved:
        stats = parse_stats(Path(saved).read_text(encoding="utf-8", errors="replace"))
        if not stats:
            fail(f"{saved}: no stats table found")
        return stats

    for attempt in range(1, ROUNDS + 1):
        for name, url in SOURCES:
            try:
                html = fetch(url)
            except Exception as exc:                # noqa: BLE001 - report and try next
                print(f"round {attempt} {name}: fetch failed ({exc})")
                continue
            stats = parse_stats(html)
            if stats:
                print(f"round {attempt} {name}: ok ({len(html)} bytes) -> {stats}")
                return stats
            print(f"round {attempt} {name}: no stats table "
                  f"({len(html)} bytes, likely a bot check)")
        if attempt < ROUNDS:
            time.sleep(ROUND_SLEEP)

    fail(f"every Scholar source failed across {ROUNDS} rounds; nothing written")


def cv_publications():
    """Return the publication count from the CV's Publications heading, or None.

    The heading reads: "Publications (* equal contribution; 97 publications,
    including 43 first and 3 corresponding author publications)". Per-year lines
    ("[2025]: 10 publications, ...") must not match, hence anchoring on the
    heading's own parenthetical.
    """
    if not CV.exists():
        print(f"note: {CV} missing, skipping Publications")
        return None
    text = subprocess.run(
        ["pdftotext", str(CV), "-"],
        capture_output=True, text=True, check=True,
    ).stdout
    m = re.search(r"Publications\s*\([^)]*?(\d+)\s+publications", text, re.I)
    if not m:
        print("note: no 'Publications (... N publications' heading in CV, "
              "skipping Publications")
        return None
    return int(m.group(1))


def main():
    incoming = scholar_metrics(sys.argv[1] if len(sys.argv) > 1 else None)
    pubs = cv_publications()
    if pubs is not None:
        incoming["Publications"] = pubs

    html = SITE.read_text(encoding="utf-8")
    tiles = TILE_RE.findall(html)
    found = [t[5] for t in tiles]
    if found[:4] != LABELS:
        fail(f"metrics band looks different than expected: {found}")

    current = {t[5]: int(t[1]) for t in tiles}
    changes = []

    for label, new in incoming.items():
        old = current[label]
        if new <= 0:
            fail(f"{label}: parsed non-positive value {new}")
        if new < old:
            fail(f"{label}: refusing to decrease {old} -> {new}")
        if new > old * 2:
            fail(f"{label}: refusing implausible jump {old} -> {new}")
        if new != old:
            changes.append(f"{label} {old:,} -> {new:,}")

    def sub(m):
        label = m.group(6)
        new = incoming.get(label, int(m.group(2)))
        return (f'{m.group(1)}{new}{m.group(3)}{new:,}'
                f'{m.group(5)}{label}{m.group(7)}')

    new_html = TILE_RE.sub(sub, html)

    summary = "; ".join(changes) if changes else "no change"
    print(f"result: {summary}")
    if changes:
        SITE.write_text(new_html, encoding="utf-8")

    out = os.environ.get("GITHUB_OUTPUT")
    if out:
        with open(out, "a") as fh:
            fh.write(f"changed={'true' if changes else 'false'}\n")
            fh.write(f"summary={summary}\n")


if __name__ == "__main__":
    main()
