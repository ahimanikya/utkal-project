---
type: release-candidate-review
status: local_candidate_for_review
---

# Bhubaneswar — a complete visitor reference

30 September 2026 · Founder & Editor-in-Chief: Ahimanikya Satapathy · implementation and self-review: Current AI assistant.

[Open the review](http://127.0.0.1:4340/) · [City guide](http://127.0.0.1:4341/destinations/bhubaneswar/) · [Dhauli](http://127.0.0.1:4341/visit/places/dhauli/) · [Verification](../../records/bhubaneswar-visitor-review.json)

## Outcome

The reading path connects the city, Dhauli, the dated Fresco archive and a personal journey. Practical guidance now covers seasons, dalma, return transport, respectful local conversations and specific access questions. The same five notes travel into both offline editions and the journey print view. Dates and personal notes remain the visitor’s own.

Mukteswar’s gateway photograph gives the city choices a different view from the cover. Dhauli’s rock-cut elephant appears beside the passage distinguishing the older landscape from the modern stupa. Both photographs retain author, date, licence and source; neither establishes present-day access. The full frames are retained.

The practical section was tightened after visual inspection: one invitation leads to labelled advice, without repeating the season or opening with three blocks of qualifications. Unverified facilities remain explicit at the relevant point.

## What was checked

67 pages build; 71 site tests and six design-system tests pass. Five visitor page types were measured at 360, 768, 1440 and 1920 CSS pixels with no horizontal overflow. Desktop passages and a phone iframe composition were visually inspected. Direct emulated screenshots have a scaling limitation, retained in the evidence.

A fresh browser journey kept its title, two dates and personal note after reload. Both downloaded HTML books were retrieved and inspected. The illustrated browser download contains three embedded photographs that decode without external image requests. A separate five-item generated sample tests a longer selection with four photos. These are HTML books, not inspected PDFs.

## Research and image trail

- [Odisha Tourism: Bhubaneswar](https://odishatourism.gov.in/content/tourism/en/discover/major-cities/bhubaneswar.html) — city context rechecked.
- [Weather and climate](https://odishatourism.gov.in/content/tourism/en/plan/Important-Information/weather-climate.html) — November–March guidance and June–September rains. Seasonal guidance, not a forecast.
- [The taste of Odisha](https://odishatourism.gov.in/content/tourism/en/the-taste-of-odisha.html) — dalma and pairings; not a restaurant inspection.
- [Dhauligiri](https://odishatourism.gov.in/content/tourism/en/discover/attractions/buddhist-sites/dhauligiri.html) — stupa and transport context; no show schedule, fare or current opening promised.
- [Andrew Moore’s Mukteswar gateway](https://commons.wikimedia.org/wiki/File:Mukteswar_Mandir_-_Torana_(24817391004).jpg) — 28 February 2016, CC BY-SA 2.0.
- [AmlanTheTramp’s Dhauli elephant](https://commons.wikimedia.org/wiki/File:Dhauli_Elephant_Statue.jpg) — 23 January 2017, CC BY-SA 4.0. Photographer identification supports the image caption, not independent historical dating.

The Nimantran operator page could not be read successfully; no recommendation, opening or menu claim was added from it. Canonical source/asset metadata, hashes and inspection limits are in the regional research packet. Fresco remains the Founder’s February 2009 archive with unresolved artist/current-condition checks.

## Review and release gates

1. Founder reviews the city flow, image choices, practical wording and the downloaded books.
2. WORK-080 remains open: use a browser with native printing support, then inspect every page of PDFs from the populated journey and both offline editions. The request to use Chrome is pending. No PDF pass is inferred from HTML or print DOM.
3. Confirm current visitor arrangements before presenting them as verified; obtain fluent Odia and relevant editorial review.
4. Review the complete candidate scope before publication. The [manifest](../../records/bhubaneswar-release-candidate.json) hashes the complete 67-page output, including earlier unreleased batches. Store is excluded; preview labels and noindex remain.

No commit, push, public release, real contribution submission, outreach or paid service occurred. The current preview uses port 4341; the older isolated server returned stale-directory errors after rebuilding, so its URL is not the review target for this candidate.

[Grouped editorial queue](city-culture-review.md) · [Design lessons](../../design-system/story-patterns.md)
