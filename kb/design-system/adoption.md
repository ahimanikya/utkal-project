---
type: "Design system adoption procedure"
title: "Adopting and maintaining the Utkal Design System"
status: "local_candidate_for_review"
---

# Adopting the Utkal Design System

The artifact is versioned independently as `@utkal/design-system`, currently **0.1.0-rc.4**. It is marked private to prevent accidental registry publication. The portable tarball is a local handoff; no new paid tool, repository or registry service is required.

## Consumer setup

1. Choose an exact reviewed version and record the adopting project, human owner, scope and any local theme exceptions.
2. Install the local package or its versioned tarball. Import `@utkal/design-system/styles.css`; wrap participating UI in `.utk`. Preserve the package's font paths and licences. Node 22+ is required for the supplied ESM icon helper and generation tools; CSS consumers need no Node runtime in the browser.
3. Reuse components and prefixed tokens. The app supplies content, actual navigation, persistence, validation and service calls. Do not treat review-gallery sample interactions as a production backend.
4. Keep identity assets separate from generic components. Other projects may adopt the component language with an explicitly reviewed theme; their charter and authority remain independent.
5. Check representative routes at phone, tablet and wide sizes, keyboard use, long content, text enlargement, image crops and print output. Review native-language text with a fluent human.
6. Record the visual decision and release the consuming project through its existing human publication process.

The README in the package contains a minimal HTML integration example. Frameworks such as Astro can consume the local CSS and icon helper without a design-system framework dependency. No automatic upgrade or cross-project deployment is configured.

## UTP adoption status and next review

The Founder authorized website adoption and feedback into the system with “Let's do that and based on what we learn update the design system”. All 50 local website pages now consume the shared system. The main shell imports the sibling package; the standalone Fresco viewer imports processed inline CSS so its fonts also pass through the build pipeline. This is a monorepo source dependency pinned by the website's Git revision, rather than an independently installed package version.

The build regenerates tokens and copies the three font licences. It records the system version in every page. UTP adapters own destination columns, photo-stage sizing and archive viewer geometry. The shared library owns foundations, normal and inverse actions, fields and generic cards. Existing journey IDs, storage versions and source provenance are preserved.

Review the [adoption evidence](../records/design-system-adoption-review.json) and [latest website manifest](../records/design-system-adoption-manifest.json). The earlier release-candidate manifest remains historical; it no longer describes the current output. The local review gallery now shows actual integrated pages, without an additional candidate stylesheet. Public release remains with the Founder.

## Maintaining the library

Technical source is `projects/design-system/`; design rationale, provenance, reviews and adoption decisions live in this KB. Run the package build to regenerate tokens and its tests to check identity, contrast, escaping, licences and packaging. Build the UTP site before generating the local gallery and pilots. Serve `projects/design-system/dist` only as a local review site; never substitute it for the public website build.

Before packaging, regenerate, test and record the archive hash. Keep fonts and their licences together. A released library version is immutable; subsequent changes get a new version and a change note. Fixes that alter visual appearance require representative screenshots and a compatibility review. Consumers pin the approved version until they choose to upgrade.

The shared Blueprint can later describe this adoption pattern. This implementation does not alter Blueprint, Collective, Unbound, Store or other project repositories.


## Twenty-item batch feedback

The accepted working baseline now serves 62 local pages. Reuse allowed city, detail, language, literary and help pages to grow without new foundation tokens. Typographic identity panels now accept a contextual label and note: a literary profile must not inherit a language/script caption. Planner controls stay in the application, with the shared field/button styling. The reusable package remains at 0.1.0-rc.2. [Batch evidence](../records/next-twenty-review.json) and [current output manifest](../records/next-twenty-manifest.json) supersede the earlier output manifest for this build.

## Story reference candidate

The previous local build had 67 pages using rc.3. Three reference stories refine the inner-page approach, and the design review gallery includes four page examples. Earlier adoption counts above describe the first adoption batch. The current review is recorded in [story reference verification](../records/story-reference-review.json).

## Local rc.4 candidate

All 67 local pages now load rc.4. The new magazine compositions are bounded to Chilika, Konark, Chhena Poda and Gopinath Mohanty; the compact mobile navigation is shared. The gallery contains these four story pages and the journey comparison. Native source data and stable saved identities remain intact. [Current checkpoint](magazine-family-review.md). This is local candidate adoption, not approval to publish or apply the design to other organizations. Earlier tarball references remain historical artifacts; no rc.4 handoff package has been published.
