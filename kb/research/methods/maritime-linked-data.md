---
type: "Linked Data Methodology"
title: "How the maritime linked data works"
description: "How the maritime linked data works — evidence, scope and reuse."
tags: ["methods", "linked-data", "maritime"]
status: "stable"
generated: {"by": "codex/gpt-6", "at": "2026-09-27T08:14:32+00:00"}
---

# How the maritime linked data works

The [JSON-LD graph](../references/data/maritime-links.jsonld) is an actual linked entity-and-claim export, alongside the OKF concept documents. It uses stable local URNs, RDF statements, Schema.org entity names and PROV source attribution. The local vocabulary and claim classes are documented within its context; they are project extensions, not part of OKF 0.2.

Each claim links a subject, predicate and object, plus evidence kind, period, source URL, supporting KB concept and limitation. Numeric observations carry value and unit; calculated observations retain inputs and formula in [the metrics dataset](../references/data/maritime-metrics.json).

## Evidence classes

- **Geographic context:** a present-day location, without equating modern borders with historical territory.
- **Archaeological finding:** reported find context, without automatically proving the carrier or route.
- **Archaeometric inference:** scientifically supported provenance with the author’s uncertainty retained.
- **Historical interpretation:** published reconstruction, not a measured sailing track.
- **Cultural commemoration:** evidence of what a ritual or institution remembers.
- **Reported statistic:** a source’s defined contemporary observation.
- **Derived statistic:** a reproducible calculation from named inputs.
- **Research lead / disputed interpretation:** searchable, but excluded from established campaign claims.

## Local queries

```sh
python3 tools/research/query_maritime.py China
python3 tools/research/query_maritime.py Paradip
python3 tools/research/query_maritime.py --kind archaeological_finding
python3 tools/research/validate_maritime.py
```

No live database or network access is required. A future website can show historical and contemporary layers separately, and reveal the source when a reader selects a connection. Graph-edge counts are counts in this research collection, not historical counts of voyages or trading partners.

## Joins that are not allowed

Do not join historical Kalinga and modern Odisha by unconditional identity. Do not treat a Chinese artefact as proof of a direct China–Odisha ship route. Do not attach Paradip throughput to every Odisha export destination. Missing state–country trade is stored as missing rather than replaced by India-level totals.

The validator checks graph integrity and arithmetic; it does not certify archaeological conclusions. This export is linked data, not an OKF Attested Computation.
