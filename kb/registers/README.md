---
type: "Project record"
title: "Utkal Project · operating records"
---

# Utkal Project · operating records

Start with the [generated dashboard](DASHBOARD.md). The [source register](records.json) owns current state and the [activity ledger](activity.jsonl) preserves events and handovers. Record significant reasons in the project's evolution history where present.

Approved by Ahimanikya Satapathy: “This is looking good, let's apply to the blueprint and UTP”. See [extension adoption](../records/register-adoption.json). Shared model: Utkal registers and ledgers 1.0.0; prior Blueprint 0.1.0-rc.1 remains preserved.

Run `python3 tools/registers.py` from the repository root to validate and regenerate. Run `python3 tools/registers.py --check` to check without writing. Requires Python 3.9+ standard library only. Views are generated locally, not by a background service. GitHub Issues/Projects are not a parallel source of truth.

Current registries index existing governance, membership, JML, brief and evidence files. Do not duplicate their contents. Sources/assets can be individual entries or explicitly identified collections; the initial collection is not a claim of a complete asset audit.

New records follow the model's type fields and source examples. Every meaningful status change also gets an activity event. No generated status, review pass or AI persona grants human authority. Keep exact event dates unknown when unknown.

Run `python3 tools/test_registers.py` for the repeatable negative checks. The same assistant implemented and reviewed this model; this is not an independent audit.
