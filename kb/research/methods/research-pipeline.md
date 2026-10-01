---
type: "Research Runbook"
title: "Sequential research queue and schedule"
description: "Sequential research queue and schedule for the Odisha encyclopedia."
tags: ["research", "pipeline"]
status: "draft"
generated: {"by": "codex/gpt-6", "at": "2026-09-30T20:24:50-07:00"}
human_review_claimed: false
---

# Sequential research queue and schedule

The user authorised this continuing research programme on 30 September 2026. Advance one bounded task at a time without requiring a new prompt. The queue covers all nine subjects; tourism is one collection. Each run may finish its task or save a useful checkpoint. A task is complete only when its stated evidence deliverable exists; a draft, blocked retrieval or planned interview is not a verified outcome.

Schedule created and confirmed active: `utkala-continuing-research`, every six hours in this chat. The first scheduled discovery continuation completed on 30 September 2026; progress and capture limits are recorded in the structured queue.

## Work order

The [structured queue](../references/data/research-queue.json) is authoritative for task status, next steps, retries and evidence outputs. The table below is the setup snapshot; consult the structured queue for later progress.

| Task | Research package | Initial status |
|---|---|---|
| RES-001 | Core publication discovery | completed |
| RES-002 | Remaining monitoring sources | pending |
| RES-003 | Recover priority source tables | pending |
| RES-004 | Tourism series reconciliation | pending |
| RES-005 | Puri craft corridor places and access | pending |
| RES-006 | Puri guides food and stays | pending |
| RES-007 | Puri journey research outline | pending |
| RES-008 | Homestay policy reconciliation | pending |
| RES-009 | Homestay operating outcomes | pending |
| RES-010 | Ecotourism and community livelihoods | pending |
| RES-011 | Food names recipes and variations | pending |
| RES-012 | Handloom techniques makers and sales | pending |
| RES-013 | District coverage matrix | pending |
| RES-014 | Western and southern coverage | pending |
| RES-015 | GSDP and sector time series | pending |
| RES-016 | Investment implementation evidence | pending |
| RES-017 | Trade logistics and production | pending |
| RES-018 | Health education and work outcomes | pending |
| RES-019 | City services and environment | pending |
| RES-020 | Smart cities rare earths and semiconductors | pending |
| RES-021 | Media language and contributor readiness | pending |
| RES-022 | Ten evidence-backed public story drafts | pending |
| RES-023 | Reader questions and navigation evaluation | pending |
| RES-024 | Next research cycle | pending |

## How each run advances

1. Read AGENTS.md, the KB index, research method, gaps, readiness, this runbook, the queue and recent research/weekly reports. Search saved knowledge first. Inspect the working tree and active work before edits; if another process is writing the same files, defer rather than overwrite it. An old in-progress checkpoint by itself is not evidence of a live process.
2. Resume the earliest in-progress task, otherwise choose the earliest eligible pending task. Update its attempt and checkpoint. Work sequentially; do not spawn parallel agents by default. Aim for a focused 20–30 minute batch rather than an open-ended crawl. Stop source retries after two meaningful retrieval approaches in a run; save the exact failure and an alternative route.
3. Browse original publishers. Record source URL, title, publisher, document/table location, period, unit, geography, price basis, estimate/project status, retrieval date and limitations. Add explained links to related concepts. Retain adverse and flat observations, aliases and revision history. Preserve the frozen imported ledger.
4. Save evidence and affected pages together. A listing or a search result does not verify a linked table. Resolve conflicts where possible; otherwise quarantine the claim, record a retry date (normally at least seven days for unchanged failures) and move to independent work. Human review, rights, interviews and operating checks remain pending unless actually established. No outreach is authorised by this schedule.
5. Run reindex and core validation plus all affected dataset validators. Refresh the log, source catalogue, summaries, manifest and portable packages for content changes. The existing packaging helper may be used while present; do not run old creation scripts over maintained records. Save an exact changed-file list and separate local, Git and website outcomes in outputs/community-project/research-runs/.
6. Persist progress, output paths, remaining questions and the next action in the queue. If unfinished, resume at the next scheduled run without asking the user to trigger it. When this cycle is exhausted, derive the next bounded tasks from real coverage gaps. If nothing is actionable, back off and retain evidence of why; do not manufacture work or success.

## Relationship to weekly maintenance

The six-hour research schedule expands and resolves knowledge. The existing weekly editor checks new releases and revisions. Both consult the same source catalogue, reliability register and recent run reports. Reuse a current capture when its scope answers the question; avoid duplicating weekly checks or racing writes. The stored weekly automation is Sundays at 09:00 America/Los_Angeles; the earlier Monday label in the runbook was a documentation error and has been corrected without changing its schedule.

This is local scheduled work and needs the local host/app available; scheduling does not provision an always-on cloud worker. Research authorisation covers local evidence and drafts. Routine validated updates may use an already verified repository and existing deployment under the weekly publication rules; this schedule does not create a new repository, site, paid service or outreach campaign. Record actual outcomes rather than assuming publication.

[Source reliability register](source-reliability.md) · [Research gaps](../about/research-gaps.md) · [Weekly editor](weekly-data-agent.md).

## Expanded scope · 1 October 2026

The user added named people, creations and English editions, sand art and other arts, garment varieties/exports and sweets economics. RES-025 completed the first evidence batch; RES-026–033 provide bounded continuations. The queue now has 33 tasks with revised ordering and preserved task IDs/history. The existing scheduled reader follows the JSON queue automatically; no duplicate automation is required. Next is RES-026. RES-011/012 retain recipe and handloom depth, while new tasks cover markets and creators without duplicating those deliverables.

### Current checkpoint · 1 October 2026

RES-026 is in progress: five author biographies deepened, five English story records plus their anthology added. The task’s eight-biography threshold and original-work chronology requirement are not yet met. Resume its saved next step before RES-027. Container and component records must not inflate book totals.

## Repository integration · 1 October 2026

This imported research describes the source workspace at its recorded dates. Utkal Project already has a repository and a published preview; current authority, implementation and release status are held in [project records](../../records/index.md) and [the operating dashboard](../../registers/DASHBOARD.md). This sync adds research for review; it does not deploy these additions or replace implemented website addenda. The scheduled research queue continues in its existing workspace pending a separate canonical-workflow handover.

## Research reuse audit · 1 October 2026

Read the [research map](research-map.md) and each task’s `reuse_before_research` pointers before browsing. The map includes existing project narratives and source records; only missing, stale or conflicted fields justify repeat research. Task IDs, completion criteria and statuses are preserved.

### Literature continuation · 1 October 2026

RES-026 reused repository-native introductions and deepened three existing biographies and three existing work records. Eight biographies have now been deepened across the two research attempts. The task stays in progress: unresolved original story dates and edition credits prevent the full deliverable. The structured queue records the specific next fields; no duplicate people or book concepts were created.

### Performing-arts continuation · 1 October 2026

RES-026 is deferred to 8 October for unavailable original-journal/title-page evidence; its criteria remain unmet. RES-027 is now in progress with four people and four attributed stage episodes. Continue the saved music task next. The earlier literary in-progress notices describe prior checkpoints, not current priority.

### Music and listening routes · 1 October 2026

RES-027 now links six practitioners and twelve work records, including one soundtrack container. Seven label/distribution recording entries were added in this pass. The task stays in progress to avoid treating the Mamata container and its songs as independent recordings and because representative playback and recording identifiers remain unverified. Continue its explicit next fields before the sport task.

### Performing-arts milestone · 1 October 2026

The bounded RES-027 set now covers **six practitioners and twelve independently scoped works or performances**: four documented stage episodes and eight catalogue recordings. The Mamata soundtrack container is excluded from this count. Two label videos passed a muted-player progression check in the current session. Historical stage records do not thereby acquire surviving video; remaining listening routes, original recording dates, identifiers, biography conflicts and media permissions retain their stated unknowns. This completes the first research set, not an exhaustive discography or editorial approval. Next eligible task: RES-028 sports.
