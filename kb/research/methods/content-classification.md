---
type: "Classification Method"
title: "Classifying and connecting encyclopedia content"
description: "Classifying and connecting encyclopedia content — context, evidence and connected reading."
tags: ["encyclopedia", "classification"]
status: "draft"
generated: {"by": "codex/gpt-6", "at": "2026-09-30T19:20:22-07:00"}
evidence_basis: "Editorial organisation of existing KB records; no new source verification or human review claimed."
---

# Classifying and connecting encyclopedia content

Use nine stable subject IDs from the [subject directory](../subjects/index.md). An entry has one primary subject and may have secondary subjects. Retain the original concept path; subject hubs reuse the record rather than create a second master.

## Separate the dimensions

Subject describes what a record concerns. Content type distinguishes a statistical topic, destination, evidence record or editorial story. Geography and period stay in the underlying record. Evidence status and publication readiness stay separate from all these classifications. A tourism campaign selection is another view, not the parent category of every fact.

The [classification register](../references/data/content-classification.json) includes canonical subject entries and all statistical topic mappings. Research methods, bibliographies, product plans and generic coverage registers are excluded from subject-entry counts. Legacy evidence is classified externally; frozen values are unchanged.

## Give a related link a reason

Every related-reading relationship has source and target concept IDs, an editorial-context label and a short explanation. Reading fisheries with food, exports and Chilika provides useful context; it does not establish that state production came from one wetland or that a particular dish caused export growth. Existing maritime evidence relationships retain their separate source-qualified graph.

## Maintain pages and data together

When a topic changes, update its explanation and related reading alongside the classification register. Do not refresh its source-check date merely because navigation changed. A public site must still select approved entries; this research catalogue is not a publication allowlist.

Run `tools/validate_classification.py`, `tools/reindex.py` and `tools/validate.py`. Check that each classified concept exists, subjects are valid, every statistical topic is covered and related links have explanations. The readable pages are local content; public filtering and search still require website implementation.

## Cross-cutting reading areas · 1 October2026

`reading_lenses` in the classification register maps the user’s explicit encyclopedia scope to stable subject IDs and existing entry paths. These editorial views preserve the nine subject families and canonical records. They add visibility to literature, science, geopolitics, religion and spirituality without reclassifying all of them as tourism or economic activity. [Scope](../about/encyclopedia-scope.md).
