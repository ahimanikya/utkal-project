---
type: Visual audit
title: Reference-page visual audit — 30 September 2026
---

# Reference-page visual audit

**Outcome: fail — repair before further adoption.** Requested by Ahimanikya Satapathy after the flow revision still felt disorganised. Reviewed by the current AI assistant using the in-app Browser skill, not an independent reviewer. Website source was not changed during this audit.

## Scope and evidence

Reviewed the local Chilika, Chhena Poda and Gopinath Mohanty reference pages at `http://127.0.0.1:4324/`. Inspected rendered desktop screenshots, page sections, computed layout and narrow-screen behaviour. Desktop evidence includes measured 1440/1669/1910 CSS-pixel views; phone layout was measured at 360 × 836. Browser zoom means emulation inputs differ from actual CSS widths; measured widths are authoritative.

Phone screenshot capture was unreliable (including a blank capture), so the phone findings use browser layout measurements and do not constitute completed visual approval on a phone. This is a focused audit of three reference pages, not all 67 pages or physical-device testing. Earlier passing build and overflow checks did not establish visual quality. Review REV-030 remains historical evidence; REV-031 supersedes its readiness conclusion.

## 1. P1 — Food text collapses into a 32-pixel column

On Chilika, “Ask about the day’s fish” breaks into fragments of one to three letters. The three short food entries occupy approximately 1,308, 1,541 and 1,388 pixels vertically. The content column is 31.996 pixels on both desktop and the measured 360-pixel phone viewport. This produces several screens of wasted space and makes the section unreadable.

The calm guide applies `grid-template-columns:32px minmax(0,1fr)` to every article. Food rows hide their number, leaving their content auto-placed into the number column. The horizontal overflow check does not detect this vertical failure.

Repair: give unnumbered food articles a single content column, or place the content explicitly. Verify all three rows visually and measure content width and height at phone, tablet and desktop sizes. Test the rendered integration, not just isolated styles.

- [Desktop screenshot](../records/evidence/visual-audit-2026-09-30/chilika-food-desktop-top.png)
- [Phone measurements](../records/evidence/visual-audit-2026-09-30/phone-measurements.json)
- Source: `projects/site/src/components/DestinationGuide.astro:37` and `projects/site/src/styles/global.css:94`.

## 2. P2 — Competing width rules disrupt the reading axis

The page changes from a centred 760-pixel introduction to a wider split story composition, then stretches experience prose across approximately 1,070 pixels, before returning to narrower sections. A broad photographic canvas is useful, but paragraphs of similar purpose should not change measure this abruptly. The experience screenshot makes the long lines and sparse rows visible.

Old ID-based destination styles set planning and experiences to `max-width:none`, defeating the newer class-based comfortable reading width. Adding another override without resolving that conflict risks repeating this failure.

Repair: establish one coherent reading grid, with explicit exceptions for images. Keep ordinary prose around 60–75 characters per line; align the story, section headings and supporting actions intentionally. Verify adjacent chapters together, not only each component.

- [Experience screenshot](../records/evidence/visual-audit-2026-09-30/chilika-experiences-desktop.png)
- Source: `projects/site/src/styles/global.css:110` and the calm-guide rules in `DestinationGuide.astro`.

## 3. P2 — Experience numbers disappear

The experience numbers 01, 02 and 03 inherit `rgb(251,246,236)`, exactly the body canvas colour. Their article backgrounds are now transparent. The numbers remain in the layout but have effectively 1:1 contrast against the page, leaving an unexplained gutter.

Repair: either deliberately remove numbering and its column, or provide a visible colour consistent with the brand. Check final computed foreground/background pairs after all page styles apply.

- Evidence: the experience screenshot above; computed colours inspected in the browser.
- Source: inherited light number colour in `projects/site/src/styles/global.css:91`, combined with the transparent calm-guide article background.

## 4. P2 — Pages end more than once

The Gopinath Mohanty page shows “Keep exploring.”, a sources disclosure, then “Keep your curiosity moving.” with another set of cards. The two large transitions compete as the conclusion. Chhena Poda also links to Pakhala and Konark in its own ending and repeats those destinations in the shared related-content section.

This is a confirmed repeated structure; the judgment that it weakens flow is editorial. Source credits can remain discreet while the reader receives one clear onward invitation.

Repair: compose one ending per page. Integrate relevant onward links into one collection, give one primary next action, and avoid repeating destinations already offered immediately above.

- [Literary-page ending screenshot](../records/evidence/visual-audit-2026-09-30/person-ending-desktop.png)

## 5. P2 — Mobile reaches the substantive story late

At the measured 360 × 836 viewport, the literary page’s first narrative section begins about 1,717 pixels down, after the header, introductory text, portrait, journey controls and section navigation. That is just over two initial viewport heights. The portrait is valuable; the combined introductory stack delays the story.

Repair direction: review the mobile opening as a whole, keep the portrait and context, and reduce repeated navigation/status space before the narrative. This is a measured pacing concern pending a reliable mobile visual review, not a prescribed fixed-height target.

## Repair order and review standard

1. Correct the food grid and invisible numbers first.
2. Resolve conflicting width ownership and establish a consistent reading grid.
3. Consolidate duplicate endings and unnecessary journey/status interruptions.
4. Review the mobile opening and the transitions between every adjacent chapter.
5. Capture usable screenshots at measured 360, 768 and 1440 CSS pixels and a wide desktop size. Inspect the whole reading journey, including the end of the page. Check for vertical failures, contrast, text measure, repeated calls to action and horizontal overflow.

The palette, real photographs and quieter presentation provide a useful base. The next step is repair and composition review; wider rollout remains open. No code, deployment, publication or human approval was performed by this audit.

## Follow-up repair

The Founder subsequently approved the fixes with “Ok let's fix it”. The [repair verification](../records/visual-repair-2026-09-30.json) records the applied local changes, measurements, screenshots and remaining review limits. The failed audit above is preserved as the before-state; it is not a claim that the original defects remain in the repaired build.
