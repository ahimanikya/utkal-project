---
type: "Information model"
title: "Language population atlas — Census 2011"
status: "implemented_preview"
---

# A population lens for living languages

Founder direction: **Ahimanikya Satapathy** asked whether the language collection included population distribution, then approved the atlas with “ok”. Prepared with AI assistance. The [language heritage model](language-heritage-model.md) remains the cultural framework; population is one dated lens within it.

The first atlas connects eight existing profiles to an interactive state/district comparison. It provides rural, urban and combined counts, male/female counts, sortable district shares, shareable selections and a CSV download. The language hub and Explore link to it. The original Census files are retained unchanged in the project KB; no visitor account or paid service is required.

## Evidence and representation

- [C-16 original](../research/references/census-2011/c16-odisha.xlsx): ORGI population by mother tongue, Odisha, 2011. The atlas extracts 3,415 state/district rows; all 21,188 source data rows receive arithmetic checks. Subdistrict data stay in the original workbook for later development.
- [C-17 original](../research/references/census-2011/c17-odisha.xlsx): statewide bilingualism and trilingualism. Additional-language returns are grouped by the parent language classification; they cannot be assigned to an individual mother-tongue entry or a district.
- [Structured population data](../research/voices/population-2011.json): original labels, codes, hierarchy, sheet rows, source URLs, checksums, denominators and profile mappings. The 30 districts retain their 2011 names. Deterministic extraction and validation run in CI.

Census language groups and individual mother-tongue entries are separate levels. ODIA has 34,712,170 people; the individual Odia entry has 31,507,158, Sambalpuri 2,629,495 and Desia 225,188. The latter entries sit within the former group in this source. Never add both levels together or infer a community’s preferred identity from that classification.

The state denominator is 41,974,218. It is computed from all 90 mutually exclusive language groups, including the residual OTHERS group. The atlas also includes 205 subordinate mother-tongue entries. A language’s share of a district uses that district’s population; a district’s share of the language uses the statewide population of the selected entry. Rural/urban selection changes both numerator and denominator consistently. Filtering districts does not change statewide denominators.

A missing district row is displayed as “Not separately listed”, distinct from a recorded zero. Positive shares below 0.01% remain visible as “<0.01%”. CSV exports carry year, code, label, classification, residence, sex counts, denominators, shares and source row. These are public aggregate statistics, not individual records.

## Interpretation and unfinished work

Counts describe reported mother tongues in **2011**, not today’s population, ethnicity, migration, vitality or everyone able to speak a language. C-17 people reporting three languages are included in the count reporting at least two. No extrapolated current estimates or district boundary map is supplied.

Kuvi is explicitly connected to entry 058006 (6,451), not the whole KHOND/KONDH group. The Census Savara entry is a source-labelled connection to the Saora/Sora introduction; community-preferred naming still requires specialist review. Sambalpuri/Kosali naming and equivalence are not settled by this atlas.

Next research: community and specialist naming review; a separately sourced historical district boundary layer; subdistrict views where appropriate; attributed demographic interpretation; and later Census editions when actually available. Each future edition must retain the old snapshot and comparability notes.

Browser policy verification currently prevents a visual audit. Automated arithmetic, integration and accessibility-markup checks do not substitute for human visual, keyboard, screen-reader or mobile review.
