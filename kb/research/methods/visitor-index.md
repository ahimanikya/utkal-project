---
type: "Index Methodology"
title: "Maintaining the linked visitor index"
description: "Maintaining the linked visitor index — visitor index research."
tags: ["visitor-index"]
status: "draft"
generated: {"by": "codex/gpt-6", "at": "2026-09-27T01:24:11-07:00"}
---

# Maintaining the linked visitor index

The Markdown concepts remain the canonical knowledge records. `references/data/visitor-index.json` is a local application export with stable concept-path IDs. Its fields are project extensions, not extra requirements of OKF 0.2.

## Relationships and unknowns

A food/place association is not a current venue recommendation. A regional pairing is an editorial choice. Area membership is not measured proximity. An onsite facility is linked to the named heritage site or visitor precinct; record its exact entrance separately before calculating walking routes. Unknown values are JSON null, never zero or false.

Food records retain the original source and inherited check dates. Adding them to this index is not an independent source check. New official listings record source-check scope, access date and an editorial review date. Source dates and review dates are different fields. A historical inauguration can establish infrastructure at that time; it cannot establish operation today.

## Maintenance

1. Search existing knowledge and preserve stable IDs before adding an entry.
2. Record narrow facts, source URLs and location scope. Keep editorial hooks in editorial fields.
3. Link heritage, food and facilities using the correct relationship. Add a venue-to-food link only when serving evidence exists.
4. For practical details, save provider identity, date, evidence, price units and route endpoints/mode. Do not infer availability, hygiene quality or universal accessibility.
5. Review facility listings monthly and all changing details before public recommendations. Record closures and conflicts without deleting their history.
6. Update area pages, the three catalogs and the JSON export together; validate counts and references. Run `python3 outputs/odisha-kb/tools/reindex.py`, `python3 outputs/odisha-kb/tools/validate.py` and `python3 outputs/odisha-kb/tools/validate_visitor_index.py` from the workspace.
7. Update the bundle log, summary and portable archive. No human review is recorded without a named actual reviewer.

## Retrieval

From the workspace, run `python3 outputs/odisha-kb/tools/query_visitor_index.py Cuttack` to retrieve matching areas and their linked records offline. General KB search continues to cover the underlying concepts.

[Visitor indexes](../visitor-index/index.md) · [Expansion roadmap](../visitor-index/expansion-roadmap.md)
