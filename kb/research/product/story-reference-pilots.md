---
type: implementation-brief
status: awaiting_founder_review
---
# Story reference pilots

The Founder authorised local implementation of the storytelling direction. Build three reference experiences: Chilika as a place, Chhena Poda as food and Gopinath Mohanty as a literary life. These are candidates for review, not publication approval.

Use existing researched facts and licensed images. Preserve source links, evidence anchors, image context, saved-journey identifiers and all other page families. Opening invitations and reading prompts are original Utkal editorial prose; they are not quotations or eyewitness accounts.

The shared pattern should support an inviting opening, a concrete reason to care, meaningful visual pauses, a readable story and a useful next action. Place pages help someone imagine and plan a visit. Food pages invite tasting and talking to makers. People pages offer a route into their work, without turning every biography into a travel pitch.

Chilika will introduce cultural meaning before practical planning. Its existing deeper research stays accessible at the end. Chhena Poda will pair the real serving with a visual tasting prompt and maker questions. Gopinath Mohanty will preserve the complete historical photograph and introduce a typographic reading route, clearly distinct from book-cover reproductions.

Extract shared patterns into a new local design-system candidate. Check page anchors and source retention, build and regression tests, keyboard actions, image loading, phone, tablet and wide-screen layouts. Keep the broader inner-page rollout open until these references are reviewed.

## Local result

Three reference pages are implemented. Shared patterns are packaged in rc.3; canonical editorial invitations are in `research/stories/reference-pilots.json`. [Pattern guide](../../design-system/story-patterns.md) and [verification](../../records/story-reference-review.json) record the result and limits.

## Founder correction on flow

After reviewing the reference pages, the Founder said: “Things are very jumpy and feel disorganized - flow is missing”. The first implementation stacked introductions, reading routes, navigation and large prompts. Passing layout checks did not establish narrative coherence.

Revise the same three pages locally. Use one opening and one navigation structure; establish the subject before its stories; keep optional media and further reading subordinate; follow the story with practical choices. Keep a stable reading axis and fewer competing surfaces. Preserve sourced content and links. Review the full sequence as well as individual components.
