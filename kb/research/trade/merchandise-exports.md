---
type: "Trade Metric"
title: "Odisha merchandise exports: five-year scale change"
description: "Odisha merchandise exports: five-year scale change — evidence, scope and reuse."
tags: ["maritime", "trade"]
status: "draft"
generated: {"by": "codex/gpt-6", "at": "2026-09-27T08:14:32+00:00"}
sources: [{"id": "maritime-exports-2026", "title": "Odisha Economic Survey 2025–26, section 1.7 and Figure 1.16", "resource": "https://assembly.odisha.gov.in/WriteReadData/News/OES%202026%20WEB%20UPLOAD.pdf"}, {"id": "export-depm-fiveyear2024", "title": "Export from Odisha during last five years: 2019–20 to 2023–24", "resource": "https://depmodisha.nic.in/website/Export/Last_5_years_India_and_Odisha_Export_Data.pdf"}, {"id": "export-parliament2910-2024", "title": "Value of exports from Odisha: Rajya Sabha question 2910", "resource": "https://sansad.in/getFile/annex/266/AU2910_uZWU2U.pdf?source=pqars"}, {"id": "export-dgcis-origin-method", "title": "DGCI&S state and district origin attribution limits", "resource": "https://ftddp.dgciskol.gov.in/dgcis/disclaimer.html"}]
verified: [{"by": "codex/gpt-6", "at": "2026-09-27T08:14:32+00:00"}]
verification_scope: "Indexed official section 1.7.2; arithmetic recomputed."
stale_after: "2027-03-01T00:00:00Z"
---

# Odisha merchandise exports: five-year scale change

The survey reports **₹47,240 crore in FY2019–20** and **₹85,540 crore in FY2024–25**. These endpoints imply **81.1% nominal growth**, or **12.61% CAGR**.[^maritime-exports-2026]

## Reuse

Use “81% higher over five years” with the years and current-price basis visible. This endpoint comparison does not establish growth every year, an inflation-adjusted increase or a record peak.

## Measure boundaries

Merchandise means goods. Do not substitute the survey’s larger goods-plus-services figure or port tonnage. A country-share table also needs its own denominator; do not infer a rupee amount for a destination until that basis is reconciled.

[Stored metrics and formula](../references/data/maritime-metrics.json) · [Destination shares](export-destinations.md)

[^maritime-exports-2026]: [Odisha Economic Survey 2025–26, section 1.7 and Figure 1.16](https://assembly.odisha.gov.in/WriteReadData/News/OES%202026%20WEB%20UPLOAD.pdf)

## Annual and sector evidence · 4 October 2026

The earlier survey endpoints above remain in their own vintage. The following DEPM table is a separate historical publication, INR crore at nominal values. The indexed official table was read; the original download failed. Five observations span four elapsed years.

| Category | 2019–20 | 2020–21 | 2021–22 | 2022–23 | 2023–24 |
|---|---:|---:|---:|---:|---:|
| Metallurgical | 24,811.40 | 38,122.95 | 86,726.64 | 62,051.15 | 58,366.83 |
| Engineering / Chemical & Allied | 4,434.18 | 7,854.68 | 15,496.37 | 8,653.98 | 9,739.98 |
| Mineral | 14,627.10 | 26,189.58 | 19,374.27 | 13,661.96 | 25,774.70 |
| Agriculture & Forest | 187.18 | 177.85 | 469.21 | 409.68 | 297.24 |
| Marine | 3,028.88 | 3,114.16 | 4,462.08 | 4,407.47 | 3,860.65 |
| Handloom | 0.90 | 0.09 | 2.02 | 1.60 | 0.48 |
| Handicraft | 3.08 | 7.74 | 9.41 | 1.39 | 0.89 |
| Textile | 131.64 | 205.50 | 630.35 | 525.81 | 706.80 |
| Pharmaceutical | 6.34 | 8.80 | 16.32 | 14.75 | 15.24 |
| Others | 11.62 | 36.97 | 10.99 | 46.16 | 29.17 |
| Total (Merchandise) | 47,242.32 | 75,718.32 | 127,232.47 | 89,773.95 | 98,791.98 |
| Software’s / Electronics | 4,500.00 | 4,701.01 | 5,207.45 | 6,104.01 | 6,725.90 |
| Total | 51,742.32 | 80,419.33 | 132,439.92 | 95,877.96 | 105,517.88 |

**2021–22 total held:** the ten merchandise sectors sum ₹127,197.66 crore, while the subtotal is ₹127,232.47 crore—a ₹34.81 crore difference. The combined total inherits the issue. All other merchandise sector sums reconcile at displayed precision. Do not silently correct either total or use the disputed aggregate in growth calculations.

Keep the publisher’s Software’s / Electronics label; its split is not supplied. Different textile and seafood releases have different definitions/vintages. Do not turn differences into a residual sector or splice the 2024–25 survey endpoint into this table.

[Structured annual observations](../references/data/export-series.json) · [Recovery story](../stories/exports-recovery-and-concentration.md) · [Products and business questions](export-business-questions.md). [DEPM original table](https://depmodisha.nic.in/website/Export/Last_5_years_India_and_Odisha_Export_Data.pdf).

### What state origin means

DGCI&S compiles declared state-of-origin codes from Customs returns and does not validate them. Its disclaimer notes missing or mistaken codes and mixed-origin shipment limitations. This supports “exports attributed to Odisha”, not verified production origin for every item. No Odisha-specific misclassification rate is known. Port tonnage is a different measure. [DGCI&S method](https://ftddp.dgciskol.gov.in/dgcis/disclaimer.html).
