---
type: "Technology Roadmap"
title: "Technical growth roadmap"
description: "Stages, upgrade triggers, cost decisions and acceptance criteria for growth."
tags: ["utkala", "technology", "architecture", "publishing"]
status: "draft"
generated: {"by": "codex/gpt-6", "at": "2026-09-27T16:22:55-07:00"}
instruction_basis: "User-agreed launch architecture in the Odisha Tourism conversation, 27 September 2026. Future stages are proposals; no deployment or billing change is implied."
implementation_status: "not_deployed"
publication_status: "not_reviewed_for_publication"
sources: [{"id": "pages", "title": "GitHub Pages limits", "resource": "https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits"}, {"id": "firebase", "title": "Firebase pricing plans", "resource": "https://firebase.google.com/docs/projects/billing/firebase-pricing-plans"}, {"id": "firestore", "title": "Firestore quotas", "resource": "https://firebase.google.com/docs/firestore/quotas"}, {"id": "storage", "title": "Firebase Storage billing requirements", "resource": "https://firebase.google.com/docs/storage/faqs-storage-changes-announced-sept-2024"}, {"id": "budgets", "title": "Firebase billing controls", "resource": "https://firebase.google.com/docs/projects/billing/avoid-surprise-bills"}, {"id": "gemini", "title": "Gemini API pricing", "resource": "https://ai.google.dev/gemini-api/docs/pricing"}]
---

# Technical growth roadmap

## Grow in response to observed needs

Keep the public KB in Git at every stage. Add a service when a concrete need appears, its operating cost is understood and its acceptance checks pass. The measures below are proposed review triggers, not automatic spending authorisation or provider limits. This roadmap has no fixed calendar and creates no scheduled jobs.

| Stage | Trigger | Deliverable and acceptance gate |
| --- | --- | --- |
| 0 — Establish the foundation | Current work | Consolidate existing OKF, brand and photo references; preserve IDs; create the intended Git repository and publication allowlist when implementing. No confidential files enter public history. |
| 1 — Launch on free services | One complete pilot is ready | Astro on GitHub Pages, domain/HTTPS, search, sourced photo story, text/email contribution paths and Firebase Spark permissions. Demonstrate one accepted contribution through to public release. |
| 2 — Improve editorial capacity | Suggested trigger: over 20 pending items for two weeks or manual work exceeds two hours/week | Better private review metadata, templates, contributor guidance and delegated roles within Spark where possible. Measure correction turnaround and failed submissions before buying automation. |
| 3 — Reliable uploads and automation | Attachment loss, repeated email limits or measurable review burden | Evaluate Blaze + private Storage/Functions. Obtain an acceptable budget before enabling billing. Test permissions, retry-safe saves, upload limits and reviewed Git export; never auto-publish unreviewed content. |
| 4 — Broader discovery and data | More reviewed districts/languages and repeated cross-topic questions | Expand linked tables, aliases, map-ready places, versioned JSON and optional SQLite downloads. Validate performance on ordinary phones and review Odia language quality. |
| 5 — Ask Utkala | Search leaves recurring questions unanswered and a viable free option or budget exists | Retrieve only approved passages, show source and contributor credit, pass the existing 15 AI acceptance cases plus English/Odia retrieval tests. No free model or gateway is assumed. |
| Recovery track — independent private recovery | Suitable free export method becomes available, or private records become operationally important | Define owners, retention and a protected independent copy; test database, identity and media restoration as appropriate. Paid private backups remain deferred until a revised decision. |

Recovery can be reviewed before any numbered growth stage. Paid AI, backup and Blaze features are not requirements for the agreed first launch.

## Capacity checks and cost decisions

Measure built-site size, Git history size, transfer, image sizes, Firebase quota use, inbox capacity, review backlog and submission failures. Record only aggregate operational metrics; keep private content out of analytics.

Suggested early review points: built output or repository history reaches 500 MB; repeated Firebase use exceeds 70% of a free quota; or any contribution is lost in an intake path. These are our conservative decision thresholds. GitHub Pages currently limits published sites to 1 GB with a soft 100 GB/month bandwidth limit, so review before approaching them. See [Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits). Firebase quotas vary by product and reset interval; check the relevant console and [Firestore quotas](https://firebase.google.com/docs/firestore/quotas).

For each upgrade, record the problem, expected monthly use, free allowance, overage rates, privacy/access changes, migration approach, rollback and accountable maintainer. Set appropriate alerts and supported caps; ordinary alerts do not cap all spending. See [billing controls](https://firebase.google.com/docs/projects/billing/avoid-surprise-bills).

The launch service target remains $0/month within free allowances, excluding domain renewal and existing tools. No earlier $10–30/month estimate is an approved launch budget. Re-estimate before enabling paid services; do not treat a free trial as a permanent funding source.

## Migration rules

**Email to managed uploads:** preserve submission IDs, credit and consent scope; transfer pending files privately; test both paths before retiring email. Keep email as a fallback until successful delivery and review have been demonstrated.

**Spark to Blaze:** upgrade only for the selected functionality or capacity. Existing public Git records remain unchanged. Restrict uploads and privileged actions; test rules, receipts, moderation and costs before general access. [Firebase plans](https://firebase.google.com/docs/projects/billing/firebase-pricing-plans) describe the upgrade; [Storage requirements](https://firebase.google.com/docs/storage/faqs-storage-changes-announced-sept-2024) explain billing for uploads.

**Static data to larger datasets:** retain CSV/JSON as source and stable IDs. Build partitioned exports; offer SQL snapshots for research. Move large media only when needed, leaving rights, checksums and canonical references in Git. A graph database or vector store requires demonstrated query or retrieval needs.

**Search to AI:** create an index from the exact approved release; test retrieval separately from answer generation. Cite source passages, qualify historical connections and preserve credit. Do not expose provider credentials in the browser. Free Gemini access has model/usage and data-use conditions; it is not a complete zero-cost chat service by itself. See [Gemini pricing](https://ai.google.dev/gemini-api/docs/pricing).

**Hosting or backend change:** preserve URLs and redirects, export public and private records separately, retain access rules and test a rollback. Public delivery should remain independent of the private intake backend.

## Community growth alongside the technology

Expand reviewed coverage, the heritage/global-connections atlas, partner directories and supervised student research through the same evidence and publication process. Internships and partnerships remain proposals until real arrangements exist. Broader living-family collection needs a defined consent and access process before intake. Do not infer lineage, ethnicity or religion from a surname or visual similarity.

The weekly data editor already exists. Update its canonical paths and release integration when the repository is connected; do not create a duplicate automation. Preserve its existing authorisation for routine validated updates while enforcing the agreed publication rules. See [weekly data agent](../methods/weekly-data-agent.md).

[Current stack](technical-stack.md) · [Architecture diagrams](architecture.md) · [Decisions](decisions.md)
