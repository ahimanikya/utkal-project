---
type: "Editorial and information architecture model"
title: "Utkal destination model and tourism benchmarks"
status: "candidate_for_founder_review"
---

# A place you can understand, then plan to visit

**Version 0.1 · research checked 29 September 2026 UTC.** Founder: Ahimanikya Satapathy. Prepared with AI assistance in response to his request for realistic narration, place-associated literature/music, practical discovery and a portable personal tour book. This is a UTP content model; no Blueprint-wide adoption is implied.

## What established tourism sites teach us

These are prominent official tourism sites selected as useful reference examples, not a ranking of the world's best websites. Observations concern publicly accessible information structure; no usability study, conversion result or booking test is claimed.

| Reference | Observed structure | Utkal adaptation |
| --- | --- | --- |
| [Japan Travel: Kyoto](https://www.japan.travel/en/destinations/kansai/kyoto/) | Destination introduction, access, highlights, areas and attractions | Explain a destination's distinct areas before asking a visitor to choose activities. |
| [VisitScotland: itineraries](https://www.visitscotland.com/things-to-do/itineraries) | Trips organized around duration and interests | Offer feasible themed days and multi-day journeys; connect food and culture to places. |
| [Switzerland Tourism: planning](https://www.myswitzerland.com/en-us/planning/) | Practical travel information alongside experiences, food and accommodation categories | Keep access, stay choices and practical needs easy to find; write inspiration and logistics as complementary layers. |
| [Tourism Australia: trips and itineraries](https://www.australia.com/en-gb/trips-and-itineraries.html) | Itinerary discovery by geography, trip style and available time | Help readers narrow choices by region, interests and days available. |
| [Tourism New Zealand: planner](https://plan.newzealand.com/planner) | Indexed entry point advertises experience selection and trip sharing | Explore a save-to-plan progression. The interactive planner returned a script shell: persistence, export and sharing behavior were not tested. |

VisitScotland also describes [changes to its visitor website](https://www.visitscotland.org/what-we-do/activity/helping-visitors-discover-scotland), including moving away from its previous listings/search model. We should learn from its current inspiration-to-planning approach rather than assume an old accommodation directory remains current.

The resulting Utkal journey is **Discover → Choose → Arrange → Carry → Revisit**. This is our synthesis, not a claim that every benchmark implements that exact sequence. Adapt information patterns, not their wording, photographs or visual identities.

## Audience and outcome

- Curious visitors and Odisha residents: understand what makes a place worth their time and select practical experiences.
- Diaspora and returning families: reconnect through stories, language, food, songs and memories while planning a real visit.
- Independent travellers: compare areas, season, interests and accommodation leads; carry the information they chose.
- Learners and researchers: reach the deeper knowledge and evidence without turning the main page into an academic apparatus.

The encyclopedia remains the knowledge foundation. Trip planning is a useful way to act on that knowledge. Engagement should come from research that helps, not compulsory accounts or commercial ranking. Evaluate usefulness through successful choices, completed/exported plans and voluntary feedback once those functions exist; no tracking service is enabled by this work.

## Reusable destination page

| Order | Reader's question | Required content |
| --- | --- | --- |
| 1. Encounter | Why stop here? | Accurate name, a short specific opening, a strong real photograph, clear depiction label for any reconstruction. |
| 2. Orient | Which part, and when? | Distinct areas or gateways, season tied to an activity, honest access knowledge and a compact jump navigation. |
| 3. Do | What should I make time for? | Three to five prioritized experiences, why each matters, its actual area and source. Duration, price and access only when verified. |
| 4. Eat | What belongs on the table? | Specific food leads, preparation/variation where sourced, dietary context and verified venues when available. Distinguish regional availability from origin claims. |
| 5. Stay | Where should I base myself? | Area suitability first; individually checked properties later. Separate leads from reviews, current availability from evergreen description. |
| 6. Hear and read | Who has given this place a voice? | Relevant poems, songs, films or testimony; exact author/work and connection type. Brief verified excerpt or licensed listening/reading link. |
| 7. Understand | What changes how I see it? | One meaningful fact, a sourced belief with its version, and links to deeper encyclopedia knowledge. |
| 8. Plan | How might choices fit together? | A feasible editorial suggestion, then the future save/arrange flow. Never invent journey times to fill a timetable. |
| 9. Evidence | Where did this come from? | Collapsed sources, source-to-section links, image rights, literary/music credits, checking date and remaining gaps. |

Optional sections may be omitted when unsupported. A place needs activity/food investigation, not fabricated lists to reach a quota. Heritage entry, food entry and biography use different content modules; do not force accommodation onto every entity. The [storytelling standard](storytelling-standard.md) governs voice and evidence.

## Realism with feeling

Use details a reader could recognize: the correct gateway, boat, ingredient, season or craft. Keep lyrical language spare and connected to evidence. Do not invent dialogue, eyewitness experience, local consensus, weather or sensory detail. A photograph is not evidence that a particular activity is always available.

Use real, permission-cleared images of the actual place first. AI illustration must preserve the geography and cultural details supported by references and carry a small visible depiction label. More photorealistic rendering is not a substitute for factual accuracy. Keep prompts and reference/rights records internally; put extended asset credit at the page end. Never suggest generated accommodation photographs document a real room or its amenities.

## Poems, songs and local memory

For each work record: title, language, creator and role, work/recording, relation to place, source and locator, exact excerpt if any, translator and rights/reuse basis, listening/reading destination, checking date and gaps. Relation is explicit: about the place, set there, recorded there, linked through a film, or later community association. These are different claims.

Verify each one; do not call a song famous merely because it appears in a catalogue. For Chilika, the prototype pairs Gopabandhu Das's existing brief verse with a reading lead for Radhanath Ray and two catalogue-linked songs from *Chilika Teerey*. Recording-level credits and playback still need verification. Full lyrics, audio and scans are not copied into the website. Local belief stays labelled beside the telling; attribution details may live at the end.

## Content contract and example

[Chilika's destination record](../research/destinations/chilika.json) is canonical inside the KB and directly rendered by the site. It uses stable typed IDs, source IDs, a review status, checking date, area/interests/diet fields and explicit research gaps. The existing [narrative record](../research/stories/narratives/chilika.json) owns the photograph, quoted verse, ecological data and legend. Do not maintain separate site-owned copies of this content.

Today's base-area records are not individual accommodation records. Do not transform them into bookable properties. Missing coordinates, operating hours, journey durations, menus and accessibility information remain missing. Before a larger catalogue, validate these conventions against several different destinations and adopt a versioned schema; the current JSON is a pilot, not a completed planning engine.

For future entities and plan behavior, see the [tour-book PRD addendum](../research/product/destination-and-tour-book.md).

## Acceptance for this iteration

Chilika has a grounded opening, three place-specific experiences, food leads, stay-base guidance, poems and songs, and a compact evidence section. Every sourced section resolves to the KB source record. Quotation and photograph credit survive the layout change. Mobile reading, keyboard expansion and local links are checked. No generic tourist image, invented restaurant ranking, fake booking availability or inactive save button is introduced. Human language/editorial review and local visitor verification remain open.
