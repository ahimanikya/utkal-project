---
type: "Maintenance Playbook"
title: "Search, reuse and update the knowledge base"
description: "Search, reuse and update the knowledge base — research and reuse notes."
tags: ["methods", "retrieval"]
status: "stable"
generated: {"by": "codex/gpt-6", "at": "2026-09-27T08:03:15+00:00"}
---

# Search, reuse and update the knowledge base

## Read without tools

Begin at the [home index](../index.md). Browse by topic or follow links from a story to its foods, textiles, places and evidence. Every concept is plain text and can be read offline. The bibliography preserves source URLs for future checking; the external pages themselves are not all archived.

## Local search

The [search tool](../../reference/research-tools.md) searches the saved concepts and aliases without network access. From the full repository root, use:

```sh
python3 tools/research/search.py "Kotpad"
python3 tools/research/search.py "pitha" --section food
python3 tools/research/search.py "growth" --section economy --limit 8
```

Search is a convenience, not an OKF requirement. It reads Markdown files directly, so edits are immediately searchable. The supplied search-index.json is a generated export for future ingestion; rebuild it with the indexing tool after changing documents.

## Add knowledge

Create a concept with a stable path, a non-empty type, title, source metadata and clearly separated fact, interpretation and research gaps. Use existing IDs where possible. Add aliases for spelling variants, and have Odia script reviewed before marking it ready. Add links to related foods, makers, places and stories. Record any actual source verification separately from authorship.

## Refresh

Check the relevant original source when a record is stale, disputed or required for a current claim. Preserve the old value in an update note, replace the complete comparable series where needed, and record the change in log.md. Rebuild the search export and run validation. A future CMS should map each feature to these stable concept IDs.

The root workspace instructions direct future research in this task to consult the KB first. No recurring update automation has been created.
