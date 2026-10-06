---
type: "Research Journey"
title: "Investment in Odisha — domestic and foreign capital"
description: "Investment in Odisha — domestic and foreign capital — scope, evidence and update rules."
tags: ["investment", "growth", "monitoring"]
status: "draft"
generated: {"by": "codex/gpt-6", "at": "2026-09-27T01:48:44-07:00"}
sources: [{"id": "investment-survey-full-2026", "title": "Odisha Economic Survey 2025–26, section 5.1.3", "resource": "https://assembly.odisha.gov.in/WriteReadData/News/OES%202026%20WEB%20UPLOAD.pdf"}, {"id": "investment-survey-summary-2026", "title": "Odisha Economic Survey 2025–26, executive summary: industrial investment and capital outlay", "resource": "https://pc.odisha.gov.in/sites/default/files/2026-02/ES-Highlights%20and%20Executive%20Summary%202026%20Web%20Upload.pdf"}]
---

# Investment in Odisha — domestic and foreign capital

## The current editorial focus

**Investment in Odisha — domestic and foreign capital, from commitment to operation.** The user replaced the standalone FDI headline track on 27 September 2026. Present values in ₹ crore or ₹ lakh crore, with stage and period beside every number. The [saved FDI series](fdi.md) remains a narrow reference, not the weekly headline.

## A supported starting point

| Measure | Period | Officially reported amount | Meaning |
|---|---|---:|---|
| 80 industrial projects described as implemented | 2025 | ₹1.75 lakh crore | Investment associated with reported implementation; cash-spend definition not established |
| 244 approved industrial projects | 2025 | ₹5.66 lakh crore | Estimated project budgets; approval does not establish expenditure |

These two values come from section 5.1.3 of the full survey's official indexed passage.[^investment-survey-full-2026] The executive summary gives less precise versions, ₹1.7 lakh crore and ₹5.6 lakh crore. Preserve both publication variants rather than treating their difference as new investment.[^investment-survey-summary-2026]

The summary also records ₹15.1 lakh crore of commitments across 275 MoUs at listed 2025 investor events, and ₹65,010 crore of state capital outlay in FY2025–26 budget estimates. These are separate coverage and status measures.[^investment-survey-summary-2026]

## What we can say

**“Odisha reports ₹1.75 lakh crore in investment across 80 industrial projects implemented in 2025.”** Attribute this to the Economic Survey and retain its implementation terminology. This is stronger evidence than an intent-only headline, but it is not an audited statewide total of cash spent or proof that every plant is operating.

The figures do not supply a domestic/foreign funding split. They are a broader industrial-investment starting point that is not restricted to the DPIIT foreign-equity series. Do not label their sum as total domestic plus foreign investment.

## Tracker design

Maintain three reader-facing views: **investment delivered**, **projects progressing**, and **future commitments**. Put an actual expenditure figure in the first view only when source scope and period support it. Keep reported implementation with its source label until commissioning or expenditure is established.

For each project capture a stable project ID, promoter, district, sector, ownership/funding origin when documented, phase, stage date, announced/approved cost, cumulative and period spending if disclosed, commissioned capacity and employment status. Unknown fields remain unknown. Match repeated announcements and expansion phases before aggregation.

Track private businesses, public-sector enterprises and government capital outlay separately. Domestic/foreign/mixed ownership and public/private ownership are different classifications. Corporate headquarters, promoter nationality or a foreign brand name do not by themselves measure how a project was financed.

Do not add MoUs, approved costs and implemented-project amounts: the same projects may appear in multiple stages. Do not add FDI flows to project costs, or cumulative capital stock to annual spending. Exclude growth/conversion rates until comparison coverage and project cohorts match. A comprehensive statewide realised investment total has not yet been established.

## Next evidence to obtain

IPICOL and Industries Department project-level implementation definitions and lists; company annual reports/exchange filings with Odisha-specific capital expenditure; commissioning evidence; Finance Accounts and budget actuals for public capital outlay; comparable five/ten-year series. Use successive releases to build evidence, not to inflate the same project's total.

[Structured seed tracker](../references/data/investment-tracker.json) · [Weekly runbook](../methods/weekly-data-agent.md)


[^investment-survey-full-2026]: [Odisha Economic Survey 2025–26, section 5.1.3](https://assembly.odisha.gov.in/WriteReadData/News/OES%202026%20WEB%20UPLOAD.pdf)

[^investment-survey-summary-2026]: [Odisha Economic Survey 2025–26, executive summary: industrial investment and capital outlay](https://pc.odisha.gov.in/sites/default/files/2026-02/ES-Highlights%20and%20Executive%20Summary%202026%20Web%20Upload.pdf)

## Tourism application evidence

The [tourism policy opportunity brief](../collections/tourism-policy-opportunity.md) tracks the new portal announcement and guidance gaps. Keep tourism incentive applications, sanctions, disbursements and operating outcomes separate, following the stage distinctions above. The proposed [experience pilot](../../specs/tourism-experience-pilot.md) tests local delivery; it is not an investment or subsidy award.
