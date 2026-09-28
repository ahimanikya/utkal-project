---
type: Maintenance guide
title: Research tools and repository context
---

# Research tools

The research documents and data are fully readable within this KB. Executable maintenance scripts live in the full repository's `tools/research/` directory and are not required to read a KB-only export.

Run from the repository root:

```sh
python3 tools/research/search.py "Kotpad"
python3 tools/research/validate.py
python3 tools/research/validate_prd.py
python3 tools/research/validate_statistics.py
python3 tools/research/validate_growth_journeys.py
python3 tools/research/validate_maritime.py
python3 tools/research/validate_visitor_index.py
```

These scripts resolve data from `kb/research/`. A structural or arithmetic check is not independent historical verification. Use `python3 tools/research/reindex.py` after changing research source documents; its export covers research only. The whole-project catalogue is generated separately by `python3 tools/catalog.py`.
