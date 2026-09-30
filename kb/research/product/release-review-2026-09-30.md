---
type: Release review
title: Utkal Project — consolidated website candidate, 30 September 2026
---

> Historical candidate snapshot. The [later editorial readiness review](editorial-readiness-2026-09-30.md) records updated content, delivery assets and the current output manifest.

# One candidate for Founder review

Ahimanikya Satapathy authorized this review preparation with “go”. **The complete local candidate is ready for review, not approved for publication.** The current AI assistant performed this self-review; no independent reviewer or new persona assignment is implied.

[Open the local review package](http://127.0.0.1:4342/) · [Website preview](http://127.0.0.1:4341/) · [Exact output manifest](../../records/release-review-manifest.json) · [Self-review and evidence](../../records/release-review.json).

This consolidates the older release-preview notes. Earlier manifests remain historical snapshots. The branch is `editorial/first-collection-review`, based at `ad0b3a6d4f93f369e6add3ee015817df7f089bff`, with substantial earlier uncommitted work. The manifest identifies the entire built output, not just this turn’s changes. A final release commit has not been created.

## What is included

72 HTML pages, including the homepage and 404 page: discovery, five city/region guides and their directory; five knowledge stories; 23 place, activity and stay detail pages; nine language pages; seven people profiles; two literature pages; five food pages; three story/archive pages; journey tools and starters; collection directories, Founder, purpose, contribution, usage and brand pages. [The route inventory](../../records/evidence/release-review-2026-09-30/static-audit.json) lists every route.

The visitor can explore 57 discovery entries, follow connected places/food/stay areas, save ideas locally, create separate journeys, assign days and dates, keep notes and download an offline text or illustrated HTML book. The archive retains its historical photographs and source context. Public GitHub Issue contribution handoff is prepared; no test submission was made in this pass.

Store is excluded from the website output and main navigation. Editorial-preview labels and noindex remain. There is no booking engine, cloud account synchronization, payment checkout, live inventory, Google Analytics integration, AI chat or generated immersive video in this candidate. Local review evidence and the KB are not included in `dist`; repository visibility is a separate boundary.

## Walk through the review

1. [Explore](http://127.0.0.1:4341/explore/) → search for Puri.
2. [Puri](http://127.0.0.1:4341/destinations/puri/) → [Raghurajpur](http://127.0.0.1:4341/visit/places/raghurajpur/): is the invitation compelling, grounded and respectful?
3. [Coastal food](http://127.0.0.1:4341/food/puri-coast/) → [stay comparison](http://127.0.0.1:4341/visit/stays/puri-coast/): does the practical guidance help without promising inspected services?
4. [My journey](http://127.0.0.1:4341/journey/): select “Release review — coast and craft”. Its synthetic eight-idea plan begins 12 December 2026; Raghurajpur is on day 2 with a personal note.
5. Open the [actual photo book download](http://127.0.0.1:4342/book-with-photos.html) and [text book](http://127.0.0.1:4342/book-text.html). The review hub also compares phone and flexible-screen layouts for ten representative pages.

Local URLs require the preview servers. Production downloads will use the production origin; these saved examples retain their local reading links.

## Fixes and release notes

- Homepage illustration reduced from 3,653,835 to 506,704 bytes (86%); favicon from 1,173,984 to 3,536 bytes. Full-frame artwork and source originals remain preserved.
- Cultural trail, archive hero, photo-essay and brand-proof images now supply intrinsic dimensions. This reserves layout space while images load; it is not a measured Core Web Vitals claim.
- Generated destination names now have consistent capitalization.
- The current story family connects city, craft, food, cultural voices and stay research to the visitor’s own plan. This release includes earlier approved development batches and their evidence, not only the small polish changes above.

The full output is about 110.4 MB, largely including preserved archive imagery and original assets. Delivery savings above concern referenced homepage/favicons, not a reduction of the entire output bundle. Other large photographs and bundled TTF fonts remain future performance work.

## Evidence and remaining review

Build succeeded: **72 pages; 78 site tests and 6 design-system tests passed**. Static review found no broken local asset/page links or missing static fragments, no duplicate IDs, and no missing alt/size attributes on images with a source. The gallery’s initially empty dialog image is intentional. All pages retain noindex.

44 responsive measurements across eleven pages at 360, 768, 1440 and 1920 px found no horizontal overflow. Targeted keyboard interactions and phone menu activation worked. The journey’s extra H1 belongs to the hidden print view; one heading is visible on screen. The downloaded photo book loaded all five embedded images, preserved credits, date and note, and requires no external assets for reading. External source links still require internet. These tests do not constitute full accessibility or physical-device certification.

The editorial pass examined representative flow and existing source/uncertainty labels; it was not a fresh independent fact-check of all 72 pages. **Keep open:** fluent language and specialist review, current local venue/transport/service verification, and unresolved mural artist/underlying artwork rights. The artisan photograph does not establish an interview or maker biography; archive images do not promise a present-day mural route. Existing subject-specific source trails remain attached to the content.

Native PDF pagination is explicitly **unverified**, tracked as WORK-080. The selected browser cannot print; HTML book verification does not close that item. No new browser-switch permission is requested here.

## Publication gate and recovery

Founder approval must identify this complete candidate, its retained preview/noindex status and remaining limitations. Approval to prepare this review is not release approval. After approval, prepare a reviewed commit/PR, rerun relevant checks, compare the output manifest, and publish through the manual `publish-site.yml` workflow from `main`. The workflow restricts execution to `ahimanikya` with `publish_approved` selected. A changed candidate requires an updated review.

After an authorized release, verify the public homepage, a connected inner-page flow, journey download and Store exclusion. Record the deployed commit and workflow result. If a release fails, stop promotion; restore an identified previously approved commit through the same manual workflow and verify it. No commit, push, merge, issue submission or deployment occurred in this review pass.
