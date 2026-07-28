#!/usr/bin/env python3
"""Update the metrics band in site/index.html from Google Scholar + the CV.

Usage: update_metrics.py <scholar.html>

Parses Citations / h-index / i10-index out of a saved Google Scholar profile
page and the publication count out of the CV header, then rewrites the four
`<span class="mv" data-count="N">` values in site/index.html.

Guards (any failure => that single metric is left untouched, and a metric that
looks implausible aborts the whole run so a bot-check page can never wipe the
numbers):
  * every value must parse as a positive int
  * no metric may decrease
  * no metric may more than double in one week
Writes `changed` and `summary` to $GITHUB_OUTPUT.
"""

import os
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SITE = ROOT / "site" / "index.html"
CV = ROOT / "CV_Jee-weon_Jung.pdf"

# Order of the four tiles in the metrics band.
LABELS = ["Publications", "Citations", "h-index", "i10-index"]

TILE_RE = re.compile(
    r'(<span class="mv" data-count=")(\d+)("[^>]*>)([\d,]+)(</span>'
    r'<span class="ml">)([^<]+)(</span>)'
)


def fail(msg):
    print(f"::error::{msg}")
    sys.exit(1)


def scholar_metrics(html_path):
    """Return {'Citations': n, 'h-index': n, 'i10-index': n} from the profile page."""
    html = Path(html_path).read_text(encoding="utf-8", errors="replace")
    # The stats table renders as: <td class="gsc_rsb_std">5044</td> in the
    # order Citations(all), Citations(since), h(all), h(since), i10(all), i10(since).
    nums = [int(n) for n in re.findall(r'gsc_rsb_std">(\d+)<', html)]
    if len(nums) < 6:
        fail(f"Scholar page yielded {len(nums)} stat cells, expected >= 6 "
             "(layout change or bot check?)")
    return {"Citations": nums[0], "h-index": nums[2], "i10-index": nums[4]}


def cv_publications():
    """Return the publication count from the CV's Publications heading, or None.

    The heading reads: "Publications (* equal contribution; 97 publications,
    including 43 first and 3 corresponding author publications)". Per-year
    lines ("[2025]: 10 publications, ...") must not match, hence anchoring on
    the heading's own parenthetical.
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
    if len(sys.argv) != 2:
        fail("usage: update_metrics.py <scholar.html>")

    incoming = scholar_metrics(sys.argv[1])
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
