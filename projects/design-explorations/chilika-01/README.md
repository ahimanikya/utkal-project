# Chilika design options · review only

Three isolated, responsive page studies. These are outside `projects/site` and its build/export. Nothing here selects, applies or publishes a design.

- A: Visual magazine — editorial opening, paired story and image, then practical choices.
- B: Photo story — wide photographic opening, a quieter reading column, larger visual chapters.
- C: Travel field guide — practical orientation and shore choices first, cultural story later.

The comparison viewer switches directions and offers a narrow phone frame. Scroll inside the frame or open a full page. Section anchors and disclosures work; the existing planner opens separately without modifying a trip. No saved design choice or analytics.

Build from repository root with `python3 projects/design-explorations/chilika-01/build.py`. Serve this directory locally on port 4338. The builder creates ignored relative symlinks to existing website assets and design-system fonts; those dependencies retain their own source and licence records. Do not package this directory alone without those dependencies.

Existing research and credited photographs are shared between all three options. No new factual research or image generation. The Satapada card uses a labelled regional Chilika view, not a claimed Satapada photograph. Sources and credits are in the end disclosure. Cormorant Garamond and the existing Odia font are local assets; this is not a new adopted typography standard.

Founder selection and refinement come before integration. See `kb/design-system/destination-options-01.md` for the durable brief and checks.

## Selected-family review

`family.html` compares the four implemented local reference pages at port 4324. Open it on the same review server at `/family.html`. Desktop/phone controls change only the review frame; working journey controls belong to the local website. This viewer does not record approval. The original A/B/C studies remain unchanged.
