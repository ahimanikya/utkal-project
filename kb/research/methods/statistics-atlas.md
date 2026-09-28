---
type: "Statistical Method"
title: "How the statistical atlas is recorded and maintained"
description: "How the statistical atlas is recorded and maintained — source-linked research, scope and reuse notes."
tags: ["statistics", "method"]
status: "draft"
generated: {"by": "codex/gpt-6", "at": "2026-09-27T01:56:17-07:00"}
---

# How the statistical atlas is recorded and maintained

## One observation, one defined claim

The atlas records a number with its unit, reference period, geography, source ID, source location, definition, evidence status and caveat. Source capture notes distinguish a downloaded/inspected document, parsed HTML/PDF and indexed-only extracts. The observation date differs from the source-access date.

Publication readiness is a triage label, not editorial approval: `hold_conflict` blocks contradictory values; `needs_source_table_review` flags limited captures; `source_checked_editorial_review_pending` still needs appropriate context and final editorial selection. No human review is claimed.

## Comparison rules

Keep survey vintages, household/person denominators, age groups, sex, price bases and administrative boundaries aligned. Accounts and visits are not unique people. Capacity, registration, budget, disbursement and actual output are separate. A percentage-point change is not percentage growth. Record source-restated baselines rather than silently rewriting old values. Do not infer causal effects or significance from two point estimates.

The calculations in the structured atlas explicitly reference their inputs. They use displayed source precision; changes are descriptive, not statistical inference. Preserve flat or negative results, uncertainty and contradictions alongside compelling positive stories.

## Retrieval and updates

Use `python3 outputs/odisha-kb/tools/query_statistics.py --topic health` or `--geography Puri`; add `--query schools` for a text search. Default output shows a bounded selection; use `--limit` deliberately. Run `validate_statistics.py` after changes, alongside the bundle checks. The atlas is the maintained research record; work files are staging inputs only and must not be rerun over later edits.

Follow release cadence: monthly public accounts, quarterly banking, annual administrative reports, periodic surveys/censuses, event-based project updates and assessment-specific environmental data. Check for a successor release before calling an observation latest. Never turn a fixed historical PDF into a live measure by updating its access date.

[Statistical atlas](../statistics/index.md) · [Structured observations](../references/data/statistics-atlas.json)
