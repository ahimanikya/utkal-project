---
type: "Research Register"
title: "Source discovery and retrieval reliability"
description: "Source discovery and retrieval reliability for the Odisha encyclopedia."
tags: ["research", "pipeline"]
status: "draft"
generated: {"by": "codex/gpt-6", "at": "2026-09-30T20:24:50-07:00"}
human_review_claimed: false
sources: [{"id": "pipeline-tourism-releases", "title": "Tourism publication downloads", "resource": "https://dot.odisha.gov.in/en/publications/tourism-download"}, {"id": "pipeline-economic-releases", "title": "Economic Survey release catalogue", "resource": "https://pc.odisha.gov.in/en/publication/economic-survey-report?field_financial_year_target_id=All&page=0"}, {"id": "pipeline-des-tables", "title": "DES data tables discovery", "resource": "https://des.odisha.gov.in/en/pages/data-tables"}, {"id": "pipeline-slbc-releases", "title": "SLBC release discovery", "resource": "https://slbcorissa.com/"}, {"id": "pipeline-trai-releases", "title": "TRAI performance report catalogue", "resource": "https://www.trai.gov.in/release-publication/reports/performance-indicators-reports"}, {"id": "pipeline-cag-releases", "title": "CAG Odisha monthly accounts catalogue", "resource": "https://cag.gov.in/ae/odisha/en/state-accounts-report?defuat_account_report_type=360"}, {"id": "pipeline-paradip-traffic", "title": "Paradip traffic report archive", "resource": "https://paradipport.gov.in/traffic/"}, {"id": "pipeline-ipindia-releases", "title": "IP India annual report catalogue", "resource": "https://www.ipindia.gov.in/pages/home/annual-report"}, {"id": "pipeline-investodisha-discovery", "title": "Invest Odisha discovery lead", "resource": "https://www.investodisha.gov.in/"}, {"id": "pipeline-urban-releases", "title": "Odisha urban activity reports", "resource": "https://urban.odisha.gov.in/en/publication/activity-report"}, {"id": "pipeline-pib-releases", "title": "PIB releases discovery interface", "resource": "https://www.pib.gov.in/allRel.aspx?reg=48&lang=2"}, {"id": "pipeline-pib-archive-guide", "title": "PIB archive discovery guidance", "resource": "https://www.pib.gov.in/Aboutarchive.aspx?lang=6&reg=17"}, {"id": "pipeline-fsi-releases", "title": "Forest Survey of India publications", "resource": "https://fsi.nic.in/reports-publications"}, {"id": "pipeline-irel-releases", "title": "IREL annual report catalogue", "resource": "https://www.irel.co.in/annual-reports"}, {"id": "pipeline-aai-traffic", "title": "AAI traffic news discovery lead", "resource": "https://aai.aero/en/business-opportunities/aai-traffic-news"}, {"id": "pipeline-mospi-reports", "title": "MoSPI report catalogue discovery lead", "resource": "https://www.mospi.gov.in/download-reports?main_="}, {"id": "pipeline-udise-publications", "title": "UDISE publication discovery lead", "resource": "https://udiseplus.gov.in/#/Publication"}, {"id": "weekly-nfhs-district-release", "title": "NFHS district release discovery", "resource": "https://www.nfhsiips.in/nfhsuser/release-details.php"}]
---

# Source discovery and retrieval reliability

Start a source check at the publisher’s release listing, then follow the linked document and compare its period and vintage. A fixed PDF is a baseline, not a feed. The [structured register](../references/data/source-reliability.json) seeds all 17 weekly tracks from saved knowledge and adds four freshly checked discovery entrances. A second batch maps initial publisher routes for the remaining groups; availability and table verification remain separately qualified. No release calendar or API availability is invented.

## First discovery batch on 30 September 2026

| Publisher | Result and next step |
|---|---|
| Tourism | Annual-report and statistical-bulletin archive is readable. The linked 2025–26 report exceeds web extraction size limits; try a direct local download before treating its tables as verified. |
| Planning and Convergence | The /en/ survey catalogue works and links full reports and summaries. The full 2025–26 PDF timed out; retain the failure and try the official DES or Finance listing. |
| DES | Data tables offer current/constant income series and district collections. Linked sheet/district extraction failed. The advertised calendar also timed out; its future publication dates remain unknown. |
| SLBC | The homepage leads to a now-readable 184th agenda PDF. Its cover identifies quarter ended June 2026. This reopens the banking research path but does not establish a new value or revision. |

The four publisher pages are [Tourism](https://dot.odisha.gov.in/en/publications/tourism-download), [Planning and Convergence](https://pc.odisha.gov.in/en/publication/economic-survey-report?field_financial_year_target_id=All&page=0), [DES](https://des.odisha.gov.in/en/pages/data-tables) and [SLBC](https://slbcorissa.com/). Inspection is scoped to listings, retrieval probes and the SLBC cover/contents. This batch imports no statistical observations.

## Fields to retain

Record discovery URL, publisher, document URL, retrieval timestamp and method, successful capture scope, exact failure, report period, publication date if established, table/page location, file checksum when downloaded, revision/supersession links, fallback route and next action. A page-footer update is not a dataset release date. A changed PDF checksum triggers comparison; it does not prove that a value changed. A working listing does not make an unavailable report unchanged.

Cadence is measure-specific. Schedule checks weekly, but import only actual releases. Keep calendar-year bulletins, fiscal-year annual reports, quarterly balances and dated project events separate. Sources with unknown schedules stay unknown. Treat full-text extraction and table verification as separate steps; inspect table images where headers or rows are ambiguous.

[Sequential research queue](research-pipeline.md) · [Weekly editor](weekly-data-agent.md) · [Coverage and conflicts](../statistics/coverage.md).


## Remaining monitoring routes mapped on 30 September 2026

All 17 monitoring groups now have an initial publisher-discovery route in the register and weekly watchlist. This completes the route inventory, not full coverage of every measure or automated extraction. Readable listings, inaccessible reports and unpopulated interfaces remain separate states.

| Monitoring need | Primary discovery route | Extraction and revision control |
|---|---|---|
| Exports, investment and project milestones | Economic Survey catalogue and PIB releases; Invest Odisha fetch unavailable | Follow dated project/release identity, preserve stage and verify realised outcomes separately |
| Port cargo | Paradip traffic archive | Monthly comparison PDF readable; keep daily reports separate from monthly and annual cargo |
| Public finances | CAG Odisha monthly indicators | August PDF now readable; provisional actuals and budgets differ, and excluded accounts limit year comparisons |
| Rare earths | IREL annual reports and PIB | Annual report readable; extract OSCOM-specific output rather than assigning company totals to Odisha |
| Health, education and work | NFHS, UDISE and MoSPI publication entrances | Direct captures failed or were empty; browser/official PDF recovery remains queued, with survey vintages preserved |
| Forests and livelihoods | FSI assessment catalogue, survey and PIB | Biennial assessment entrance found; chapter retrieval failed; preserve revised comparison baselines |
| Smart cities and urban services | Odisha urban activity reports and PIB | Current fiscal-year catalogue available; linked report failed; service outcomes need their own evidence |
| Mobility and digital access | AAI traffic and TRAI performance catalogues | AAI unavailable; TRAI listing readable but linked PDF probe failed; retain period and provisional status |
| Innovation and startups | IP India annual reports and PIB | Patent catalogue readable; applications, grants and startup recognition populations remain distinct |

Readable PDF probes recovered the CAG August 2026 report and located the Paradip May 2026 comparison and IREL 2024–25 report. No numeric observations were imported. PIB’s list did not populate in text extraction; its zero display is not evidence of no releases. A school-education alternative redirected to another hostname and yielded no publication content, so it is not treated as verified evidence.

For each route the structured register saves the attempted method, current capture scope, extraction plan and proposed revision signals. File hashes and changed titles are prompts for review, not proof of a changed value. Failed routes have a future retry date; source-specific recovery can proceed earlier through a different official route when a queued task requires it. Unsupported future release dates and publisher revision policies remain unknown.

## Bounded recovery and reconciliation · 30 September 2026

The [recovery register](../references/data/source-recovery.json) records failed direct downloads of the tourism annual report, full survey and three DES workbooks. The [Finance catalogue](../sources/pipeline-finance-survey-alternative.md) supplies another official survey URL, but web extraction rejected its size. DES offers XLSX files: an unsupported format response is a tool limitation, not a missing dataset. Workbook sheets, cell ranges and periods remain unknown. Retry after 8 October; earlier failures are retained.

A readable [Ministry tourism release](../sources/tourism-pib-20251208.md) supports the saved central foreign-visit count. The [reconciliation record](../references/data/tourism-series-reconciliation.json) keeps it distinct from the state bulletin and records unavailable parliamentary PDFs. No failed fetch was labelled unchanged.

## Named guide discovery · 1 October 2026

The [alternate official guide directory](../sources/puri-guide-app-directory.md) exposes named cards where the saved main-directory capture did not. Reuse this route for public profile research, while keeping credentials and availability unknown. The contact form would notify an agent and was not submitted. This supplemental route does not change the 17 statistical monitoring tracks.
