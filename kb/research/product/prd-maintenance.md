---
type: "Product Governance"
title: "Maintaining product requirements history"
description: "Versioning, snapshot preservation, requirement traceability and update checks."
tags: ["utkal", "product", "requirements", "history"]
status: "draft"
generated: {"by": "codex/gpt-6", "at": "2026-09-27T16:31:36-07:00"}
instruction_basis: "User requested a detailed PRD for historical reference; product decisions consolidated from the Odisha Tourism conversation through 27 September 2026."
document_version: "0.1.0"
approval_status: "draft_not_formally_approved"
implementation_status: "not_deployed"
sources: [{"id": "architecture", "title": "Agreed technical stack", "resource": "../technology/technical-stack.md"}, {"id": "decisions", "title": "Architecture decision register", "resource": "../technology/decisions.md"}, {"id": "editorial", "title": "Community encyclopedia direction", "resource": "../about/community-encyclopedia.md"}]
---

# Maintaining the PRD and its historical record

## Authority and status

`product/prd.md` is the readable current document. `references/data/product-requirements.json` is its machine-readable requirements view. They describe one product baseline and must change together when requirement meaning changes. `product/versions/` and versioned requirements files preserve prior baselines. `references/data/prd-version-register.json` identifies the current version and checksums.

The initial v0.1.0 is a draft synthesis. It captures previously agreed decisions but does not claim formal approval of every acceptance detail. Keep lifecycle, approval, implementation, test outcome and public publication approval separate. Do not infer a human reviewer from an agent-generated document.

## Version rules

- Use a new **minor** version for meaningful scope, requirement, acceptance, policy or priority changes before a product release, such as 0.2.0.
- Use a new **patch** version for corrections or clarification that do not change intended behaviour, such as 0.1.1.
- Use 1.0.0 only when the owner explicitly designates an approved product baseline; a deployed website and a PRD version are related but different things.
- Give each requirement a permanent ID. Retire IDs explicitly; never reuse them for another purpose. Preserve their prior meaning in older snapshots.
- Record experiments as proposals; do not promote an experiment or paid feature to agreed launch scope without a decision.

## Update procedure

1. Read the current PRD, architecture decision register and latest user directions. Identify affected IDs and distinguish a correction from a scope change.
2. Prepare the changed requirements, acceptance criteria and consequences. Update narrative and structured register together. Record the decision basis honestly, including when it is still proposed.
3. Append a revision/history entry with rationale and affected IDs. Update related technical decisions when necessary; avoid allowing the PRD and architecture to prescribe conflicting launch behaviour.
4. Allocate a new version. Save a new readable snapshot and a corresponding versioned JSON requirements snapshot. Preserve all previous files unchanged. Fix relative links for the snapshot folder.
5. Calculate SHA-256 checksums, append the version registry entry and move its current pointer. Do not invent a Git tag; add a real revision/tag only after it exists.
6. Run `python3 outputs/odisha-kb/tools/validate_prd.py`, then the existing `reindex.py` and `validate.py` tools. Update the bundle log and checksum manifest.
7. Record acceptance-test results in release/test evidence, not by rewriting a preserved PRD. A result should reference requirement ID and PRD version, tester, date, outcome and evidence. Mark a requirement implemented only with actual implementation evidence.
8. When releasing a new edition, update summaries and the portable bundle according to the existing project procedure. A documentation update alone does not publish the website or change service billing.

## Preserving history

Snapshots are immutable by project convention. The validator detects changed snapshot hashes and cross-reference inconsistencies; it cannot prevent a person who changes both a file and its registered hash from rewriting history. Once Git is connected, reviewed changes and real version tags provide stronger history. Keep local copies in the meantime.

Do not overwrite current documents from old generation scripts. The scripts used to author the initial baseline are not an approved recurring publishing pipeline. Future work should edit the maintained files and append a new version deliberately.

The version register preserves requirements snapshots as well as the narrative. This matters because a historical PRD linked only to a changing current table would not preserve its original acceptance criteria.

## Traceability

User decision → architecture decision where relevant → requirement ID → acceptance criterion → implementation change → observed test evidence → release revision.

Not every requirement needs an ADR; product goals and programme requirements may trace directly to user direction. Each field must distinguish proposed, agreed, implemented and verified states. A provider pricing statement must carry its own check date when re-used for a purchase decision.

[Current PRD](prd.md) · [History](prd-history.md) · [Technology decisions](../technology/decisions.md)
