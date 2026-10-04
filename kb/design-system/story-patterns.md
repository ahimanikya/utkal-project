---
type: design-pattern-guide
status: local_candidate_for_review
---
# Stories that invite a next step

Utkal Design System 0.1.0-rc.4 provides optional storytelling patterns. The reference pages were simplified after the Founder found the initial composition jumpy and disorganised. Creative direction belongs to Ahimanikya Satapathy. The purpose is to make a story worth reading, worth sharing and worth acting on. Audience response has not yet been measured.

## A shared structure with room for different subjects

| Subject | Opening | Visual rhythm | Meaningful next step |
| --- | --- | --- | --- |
| Chilika as a place | A boat, birds and the invitation to choose a shore | Wetland photograph beside poetry; island photograph beside a recorded legend; ecological detail; practical choices | Pick an experience and save ideas in a journey |
| Chhena Poda as food | A real serving and the contrast of edge and centre | One serving photograph, then taste, origin, preparation and ordering in a continuous reading column | Save the dish, ask about preparation and record a personal discovery |
| Gopinath Mohanty as a literary life | The complete historical photograph and a question about the lives inside a landscape | One complete historical photograph, followed by life, Paraja, other works and listening in a consistent reading column | Choose an edition, follow recordings or explore more writers |

A place can create a desire to visit. A person’s story may create a desire to read. Do not impose the same travel ending on every subject.

## Compose the whole story first

A component is an option, not a requirement. Do not stack an invitation, reading trail, navigation, highlight cards and a second introduction before the article begins. One opening should lead directly into the subject. One navigation structure should help the reader return to it.

For Chilika, use: meet the lagoon → poetry and local belief → understand the living habitat → plan a visit → experiences, food, stays and local guidance. Supporting song catalogues and the photo journey remain available through optional disclosures. Keep explanatory labels beside legends and dated evidence.

Maintain a stable reading axis, consistent heading scale and deliberate section spacing. Let pictures support adjacent passages. Do not alternate layout, colour and width merely to add variety. A change in presentation should signal a meaningful change in the story.

Avoid repeating the same photograph as hero, detail crop, destination card and experience card on the same reading path. Preserve the most useful appearance; optional media can reuse it with context. Keep repeated save controls quiet, and show journey navigation and the active journey once where practical.

Review the outline and a continuous scroll through the page. Passing responsive, link and source tests is necessary but cannot establish narrative coherence. Founder assessment of the reading experience remains essential.

## Optional components

`utk-story-invitation` joins a reason to care with one relevant action. It contains an eyebrow, heading, brief paragraph and labelled link. On narrow screens the action follows the copy.

`utk-story-trail` is a short ordered set of reading doors. Use three when there are three useful routes; it is not a required quota. Numbers are decorative, while the ordered list supplies the sequence. Labels and destinations must explain the actual sections.

`utk-story-pause` creates space for an observation or question inside the reading. Identify original prompts and avoid making an editorial line look like a historical quotation.

`utk-story-prose` offers a bounded reading measure for new consumers. Existing page adapters retain their own bounded prose rules. Subject-specific photographs, biographies, sources and planning controls remain in the website rather than the shared package.

## What the pilots taught us

- Give broad images room while keeping paragraphs within a comfortable reading width.
- Pair an image with the passage it helps explain. The chapter photograph can carry more meaning than a decorative background.
- Historical portraits need composition-specific treatment. Showing the whole Gopinath Mohanty photograph retains his wife and the context of the image.
- A typographic panel may introduce a book, but should not repeat an introduction already present in the prose. The large prototype panel was removed from the profile.
- The repeated food photograph was removed because it did not explain a new detail. Reuse only when it adds understanding and identify the repeated view.
- Keep Odia verse large enough to read; generic paragraph rules must not shrink it.
- Keep desktop and phone reading order coherent. Avoid rearranging chapters visually with CSS.
- Keep source and rights details at the end, while dates, uncertainty and belief labels stay beside the claims they qualify.
- Preserve familiar save actions and stable journey identities when changing presentation.

## Editorial data and boundaries

The earlier opening invitations and reading routes are retained as a copy study in `research/stories/reference-pilots.json`; they are no longer stacked into the reference pages. Existing research packets remain authoritative for factual paragraphs, dates, quotations and image rights. No new external factual research, AI image, film or media asset was created for these pilots.

The gallery now offers Chilika, Chhena Poda, Gopinath Mohanty and the existing journey page. Review preferences are stored separately by candidate version; older preferences are not overwritten or assumed to approve the new layouts.

These three pages establish a local reference. The wider inner-page rollout, native Odia review, new illustrative media, dedicated sharing features and audience evaluation remain further work. No publication or cross-project adoption is implied.

[Implementation brief](../research/product/story-reference-pilots.md) · [Initial verification](../records/story-reference-review.json) · [Flow revision review](../records/story-flow-review.json)

## Lessons from the rendered-page audit

- Give each page composition ownership of its layout. Older wide-layout selectors must explicitly exclude the continuous-reading variant; section IDs are navigation targets, not reasons to override reading width.
- Optional decorations must not determine where content lands. Removing a number also removes its reserved column. Verify both numbered and unnumbered content with real text.
- Ordinary practical chapters share the same reading measure. Wider photographs and paired visual stories are deliberate exceptions.
- Give a page one onward-discovery ending. The page and shared shell must not each append their own competing conclusion.
- On phones, a compact native disclosure can preserve chapter navigation without putting every link before the story. Keep it keyboard-operable and preserve the original reading order.
- A complete historical photograph may be scaled down; do not crop out a person to shorten an opening.
- Visual checks must include text-column width, vertical expansion, final contrast and chapter transitions. No horizontal overflow is only one check. Keep screenshot or device limitations explicit.

These lessons are trialled in the local website adapters; the shared rc.3 library package is unchanged. [Audit](visual-audit-2026-09-30.md) · [Repair evidence](../records/visual-repair-2026-09-30.json).

## Selected destination composition: visual magazine

The Founder chose direction A from three complete studies. Trial it first on Chilika: an editorial title beside a real image, literature paired with a relevant photograph, a small set of illustrated local choices, a warm food chapter and practical visit planning. Use restrained separators and a consistent reading axis to connect the chapters. Keep detailed research and credits available through labelled disclosures.

Preserve source identifiers, stable journey identities and qualification labels while changing presentation. Direction A owns its layout instead of inheriting the old destination grid. Its first implementation remains a website adapter; generalise only after the Founder reviews the complete page. Food and person pages are not automatically converted.

[Selected direction and preview](destination-options-01.md) · [Verification](../records/magazine-a-review.json).

## Four-family checkpoint

The shared magazine stylesheet now owns composition geometry in rc.4. UTP binds it through a shared cover and distinct place/article components. Konark demonstrates a historical opening without a fabricated quote; food foregrounds an attributed origin account; the person page keeps the complete portrait and links to reading beside the relevant chapter. Mobile DOM order is title, photograph, actions, then story.

Keep detailed research available without making the first reading a checklist. When an image is reused to explain a different choice, label its location accurately. Existing photographs are retained; there is no new historical reconstruction or supplier/venue endorsement.

[Review all four pages](magazine-family-review.md). The next step is the agreed human review checkpoint before wider page-family adoption.

## Carry the story into the visit

The Founder authorised continuation beyond the four-family checkpoint. Detail pages use the shared cover and reading sections, then connect the place, experience and stay-area guide with explicit relationship labels. Keep accommodation research distinct from a reviewed property.

- Long place and activity titles need a smaller detail-page type scale. Verify the winning computed styles as well as the stylesheet: equal-specificity rules loaded later can silently undo an adapter.
- Discovery should offer a small set of pictured stories with one clear headline link each. Preserve full historical portraits and retain rights information in the end credits.
- Put the visitor’s current plan ahead of management tools. Group backups and trip management behind a labelled native disclosure.
- Keep suggested ideas bounded. Show more should reveal a small next group, focus its first link and preserve filtering. Avoid making the visitor pass an entire catalogue to reach downloads.
- Give place and stay-area entries distinct saved names, while retaining stable IDs. Group related local stops consistently to avoid false transfer warnings.
- A responsive layout check, a downloaded HTML book and native PDF pagination are different checks. Record each separately.

[Integrated evidence](../records/visitor-flow-review.json). These are UTP adapters over rc.4; no shared-package version change or public release.

## Cities and cultural voices

A city guide follows its historical thread before presenting pictured choices. Separate the dated photo archive from a current visit recommendation; carry that distinction into saved journeys. A saved item must lead to its actual detail page, not back to an indistinct city anchor.

Language and literary pages share reading geometry but need their own visual logic. Preserve complete portraits and identifiable script samples. Where a relevant photograph is unavailable, use a clearly labelled typographic panel without inventing a community image. Keep script samples legible, accurately named and uncropped. Avoid presenting a generic manuscript as a named work.

Give each page one onward section. When removing a duplicate shell ending, merge its useful links into the page’s own ending and test their survival. Recheck every sourced paragraph, roster and source link after moving content between components.

Use the research register for facts and review status; presentation work does not confer editorial approval. Consolidate overlapping review entry points, not historical evidence or human decision records.

[City and culture review](../research/product/city-culture-review.md). These adaptations use rc.4 without changing the reusable package version.

## A visitor reference must survive the download

Place practical guidance beside the decisions it helps: season, meal, return transport, local interaction and access. Avoid repeating the same climate information in both the introduction and the first practical note. Keep uncertainty specific, rather than placing a wall of qualifications before the useful information.

Carry those notes into both portable editions and the print view, using the same canonical content and source trail. Retain access advice on individual saved choices. An HTML export, its downloaded bytes and native PDF pagination are separate acceptance checks.

Use a different photograph when it explains a different feature. The gateway adds detail to Mukteswar’s wider cover view; Dhauli’s elephant belongs beside the older-landscape passage, not in an unrelated gallery at the end. Preserve full frames when cropping would remove their context.

[Bhubaneswar candidate and evidence](../research/product/bhubaneswar-visitor-candidate.md). Local website adaptations; shared rc.4 package unchanged.

## A destination should lead to a meal and a base

Connect place, food and stay research through one onward section and stable saved identities. Expand starter selections only when a reader creates a new journey; never silently change an existing plan.

Use consistent comparison fields for each stay option. On a phone, stack the options in reading order with visible labels rather than forcing a wide table. Keep contextual photographs clearly captioned when they depict the city or a dish rather than a named property or restaurant.

An architectural portrait may need its whole frame. Honour the asset’s contain instruction in detail covers, and check the actual photograph at phone width. Avoid cropping away the feature the text asks the reader to notice.

[Bhubaneswar collection review](../research/product/bhubaneswar-collection.md). Website adapters over rc.4; reusable package version unchanged.

## Regional collections: preserve the person and the connection

A maker photograph can explain why a craft matters, but an unnamed subject must not acquire an invented identity or story. Keep dated history, visitor testimony and today’s arrangements distinct. Carry photographic provenance into every reuse, including the journey book.

Use one regional meal composition with different canonical content and onward choices. Preserve existing food and stay save IDs as the guide grows. Optional short section-menu labels help a phone reader scan a long narrative without shortening its actual headings.

When consolidating page endings, verify every earlier reading connection survives. Secondary food entries need working detail links too. Test these as visitor paths, not only as component output.

[Coastal collection evidence](../research/product/coastal-collection.md). UTP adapters over rc.4; package version unchanged.

## One collection, one clear way onward

Give connected stories a shared chapter list with a visible current-page marker. Make the next story the primary action; let the final story hand over to personal planning. Use a short editorial bridge and a relevant, credited photograph to explain the connection. Reading order must not imply checked travel timings.

Keep other worthwhile connections in a quieter disclosure. Merge duplicate endings without dropping their useful links, saved identities or older deep links. A chapter link works without JavaScript; a personal journey uses the existing browser storage model.

Test a complete visitor path as well as the individual component: traverse the collection, create a separate plan, add a note and reload. Record what was actually exercised by keyboard versus pointer. Preserve failures and repairs in the review record.

[Five-story implementation and evidence](../research/product/coastal-reading-flow.md). This is a UTP adapter over rc.5; the shared package version is unchanged by this increment.

## A focused edition must include only its own visitor choices

A smaller collection needs matching search results, correction subjects, saved choices, starter selections and downloadable photographs. Hiding a navigation link does not remove content from the delivered browser data. Keep the editorial boundary explicit and validate the actual output before promoting it.

Preserve earlier saved identities and notes when a place leaves an edition. Explain an unavailable choice without erasing the reader’s work. Test a failed build as well as a successful one so the last good preview remains usable.

[Coastal launch evidence](../research/product/coastal-launch-preview.md). Website implementation over rc.5; shared package unchanged.

## Let the reader keep control of the story they collect

Private notes should remain private unless the reader chooses to include them. Keep the saved original complete, make sharing choices explicit beside the download, and explain the difference between a portable reading copy and an editable backup. A plain-text itinerary is useful alongside a visual book.

A save failure must never be followed by an unqualified success message. Preserve recoverable work, explain conflicts, and test two tabs as well as one. After replacing a state object, event handlers must address the current item rather than a stale captured copy.

Search normalization must preserve meaningful Odia marks. Field-length help belongs beside the field, associated through its description; it should not make the accessible name change on every keystroke. Checkbox controls need their own sizing rule while their labels keep a generous interaction area.

Review layout at real iframe widths, then inspect representative visuals. A geometry pass alone will not catch a badly aligned checkbox. Record which type of check was performed.

[Implementation and review evidence](../research/product/overnight-200.md). Website adapters over rc.5; no shared package release in this batch.

## Give the reader a question, then room to answer

A visit notebook can connect a story to action without pretending to know the reader’s schedule. Keep an observation and preparation prompt visible; place social, onward and memory prompts in a native disclosure. Give the section a stable link, preserve the existing onward path and explain original editorial framing at the quiet end of the page.

A personal day need not contain a stop. Model a pause explicitly, and treat the day’s title as private writing too. Move ideas and Shift days are different actions: explain which notes travel with each. Undo must refuse to discard a newer edit. A copy keeps the original; a move does not.

Use the same KB prompts in the page and portable outputs. Verify stable identities, safe imports and actual two-tab behavior. Evidence output must target disposable build storage by default, then be archived explicitly to a new batch path.

[Next 210 implementation and limitations](../research/product/next-210.md). Website adapters over the existing rc.5 package; no new shared-package release.

## Turn questions into optional preparation

Put detailed preparation questions behind a clear disclosure, after the story has established why a visit matters. Carry the same public questions into saved guides and portable books. Let the reader explicitly copy a question into private writing; never treat that copy or a tick as a verified arrangement.

Import previews should name the destination and explain which fields travel. Keep independent import, ideas-only merge and complete replacement visibly distinct. Refresh a preview after intervening edits. A smaller export should preserve original day numbers and leave the saved whole unchanged.

Keep shared-copy privacy adjacent to export scope. Explain that public questions can remain while personal reminder wording and ticks are excluded. Test expanded controls at real layout widths, and align the review frame before capturing evidence.

[Preparation delivery and limitations](../research/product/ready-216.md). These are UTP adaptations over rc.5; no shared package release is implied.


## Keep preparation before the onward invitation

Place current-arrangement notes inside the guide’s reading width, alongside the planning material and before the personal notebook, onward invitation and credits. Avoid adding destination-specific material after the entire page through the global layout: that breaks the ending and can introduce a second width constraint. Render each note only once on its intended routes.

For a getting-started guide, keep the first action and consequential limits visible: browser-only storage, backing up and private notes in shared books. Put detailed editing and import semantics in labelled native disclosures. The short reading path should still explain how to begin and what to preserve.

This lesson follows the [first-edition editorial review](../records/first-edition-editorial-review.json). Source/build review only; rendered browser checks remain open. No shared package version change.


## One contents pattern, including the smaller guides

Use the compact native contents disclosure on place, experience and stay-area details as well as main destination stories. Keep the desktop links, section names and reading order consistent. Selecting a mobile chapter closes the contents, opens any collapsed destination panels and focuses a visible heading or the destination disclosure’s summary. Escape returns focus to the contents summary.

A link into a collapsed panel should reveal only the panel and its enclosing disclosures. Handle initial links, repeated links and browser history; decode IDs without treating them as selectors. Keep modified clicks, downloads, external links and new tabs native. On initial arrival, reveal and position the target without taking keyboard focus. Leave unrelated panels closed, and respect reduced-motion styles.

[Guide navigation candidate](../records/guide-navigation-review.json) records source/build tests and the outstanding browser check. This is a UTP implementation lesson, not a shared-package release or a completed accessibility audit.


## Deliver collection images for their actual space

Use the shared responsive-image component for Explore cards and onward-story photographs, with sizes matched to the layout’s breakpoints. Keep original paths as fallbacks, natural dimensions, captions, alt text, licences and end credits. Small script SVGs remain vectors. Portable-book assets retain their existing identities and credits; an on-page reuse may offer responsive derivatives without changing the book.

Name generated image assets from their encoded bytes. Adding an unrelated image must not change the address of an existing rendition, and different encoder output must not masquerade under the same address. Export only renditions referenced by the selected publication pages. Compare encoded byte totals explicitly; that comparison does not measure visitor speed, browser-selected requests or perceptual equivalence.

[Collection image-delivery review](../records/collection-images-review.json) records coverage, byte comparisons and the missing onward-image case found by the regression check. Visual and physical-device review remains open.


## Let readers widen a search without starting over

Keep topic, area and ordering choices reversible through Back and Forward. Group uninterrupted typing into one search step, and finish character composition before changing results. Restore both controls and results from a shared URL. Modified links retain normal browser behavior.

Show topic counts within the current query and area, and offer separate removal of the query, topic and area. Empty results should point to those choices. Return focus to the relevant control when its removal button disappears. Keep the collection available without scripting; never make client filtering the only access to entries. Reorder card nodes only when ordering changes, so typing does not repeatedly detach photographs.

[Explore filter-flow review](../records/explore-filter-flow-review.json) records controller and built-page checks. Native browser, screen-reader and physical-device verification remains open; this is a UTP pattern, not a shared-package release.


## Let a trail offer choices without promising a circuit

A place with several gateways needs a clear choice before a timetable. Give its illustrated reading path a dedicated page when a second long story would overwhelm the starter collection. Reuse the same chapter component for a section or a page, with the correct heading hierarchy, unique control IDs, full photographic context and source notes at the end.

Link the same curated trail to several starting collections when their places belong to one broader story. Carry only chapters matching the visitor’s selected ideas into their book, including selected-day exports. Keep old plans untouched. Return from each guide to the trail, and offer contribution questions suited to the place. Regional imagery must stay labelled as regional.

[Chilika trail candidate](../records/chilika-illustrated-trail-2026-10-04.json) records source/build and export checks. Browser visual and native PDF review remain open; this is a UTP implementation pattern, not a shared-package release.
