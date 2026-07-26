# Website ideas — parking lot

Ideas considered but deferred, so they aren't lost.

## Idea B — Signature "hearable" hero (DEFERRED, high potential)

**Why it's strong:** Jee-weon studies speech deepfakes and speaker recognition. Almost no academic site is *about* something you can hear. A signature interactive hero would make the entire research thesis visceral in ~5 seconds and be genuinely memorable — a real differentiator vs. every other researcher homepage.

**Two variants:**

1. **"Can you spot the fake?"** — two short audio clips, one real and one AI-generated. The visitor listens, guesses, then the page reveals which was synthetic (and ideally *why* — a spectrogram artifact, etc.). Directly dramatizes anti-spoofing work.
   - Needs: 2 short clips (one bonafide, one synthetic) that are cleared to publish. Self-contained site means embedding them (check total size; short/compressed clips only).
   - Skills: plain `<canvas>` waveform + audio elements; optionally `shaders-cursor-ripples` / `threejs` for a spectrogram flourish.

2. **Reactive spectrogram / waveform hero** — the V1 "Signal" concept (animated waveform) rendered as an accent inside the current "Journal" layout (not a full redesign). Lower lift, no audio-clearance issue, still on-theme.
   - Skills: canvas (as in `mockups/v1-signal.html`), or `webgl-3d-object` / `threejs` for a 3D spectrogram.

**Open questions to resolve before building:**
- Audio rights: are there clips Jee-weon can publish (own voice + a synthetic version)? Otherwise go visual-only (variant 2).
- Restraint: keep it a single tasteful centerpiece; the rest of the page stays the refined "Journal" style. Avoid tipping into over-designed/AI-slop territory.
- Accessibility: audio must be opt-in (click to play), with captions/labels; respect reduced-motion for any animation.

**Status:** parked at user's request (2026-07-25) — "still a good idea, I just need to think more." Revisit after Direction A polish ships.

---

## Direction A — Refined polish (IN PROGRESS / chosen)
Keep current structure; add subtle on-load + on-scroll motion, a credibility metrics band (count-up), and a three-pillar research framing. See git history / CLAUDE.md.
