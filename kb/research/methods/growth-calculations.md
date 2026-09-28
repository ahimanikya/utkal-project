---
type: "Methodology"
title: "Growth calculations and comparison rules"
description: "Growth calculations and comparison rules — research and reuse notes."
tags: ["methods", "economy"]
status: "stable"
generated: {"by": "codex/gpt-6", "at": "2026-09-27T08:03:15+00:00"}
---

# Growth calculations and comparison rules

Percentage change = (end value / start value − 1) × 100.

Compound annual growth rate = ((end value / start value) ** (1 / elapsed years) − 1) × 100.

For the six observations FY2019–20 through FY2024–25 there are five elapsed years. Retain unrounded values for calculations and round only for display. The [stored dataset](../references/data/industry-growth-data.json) includes the original values, source locations and interpretive caveats.

The supplied [validation tool](../../reference/research-tools.md) recomputes both measures for all nine real sector series and ten supporting comparisons. It also checks source-reference keys and internal links. Successful arithmetic checks do not independently authenticate a source or establish comparability.

Do not add overlapping sector changes. Do not compare a current-price series to a constant-price series as if they were identical. A revised estimate supersedes an earlier vintage only when the underlying series is updated coherently. Preserve the prior record in the change history if a publication claim changes.

This is a reproducible calculation method. It is not represented as an OKF Attested Computation because this bundle does not implement an executor/receipt/attester contract.
