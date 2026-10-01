# Utkal editorial workbench

A read-only view of the project KB for choosing the next useful story task. The public tourism site does not import or publish this project.

From the repository root, run `python3 tools/editorial/build_workbench.py`, then open `projects/editorial-workbench/dist/index.html` in a browser. It works without a service, account, network connection or installation. External source/KB links require a connection. The generated HTML stays outside Git; the canonical assessment is [in the OKF bundle](../../kb/records/editorial-workbench.json).

Search by subject, source or question. Filter by record type or evidence gap, inspect existing connections, and download the filtered records for an editorial session. Downloads are copies; this interface never updates source records or grants approvals.

The frozen selection is 361 source identities, 64 people, 48 works, 23 food concepts and four priority places. These are **500 metadata assessments**, not 500 completed research assignments. Newer matching records are listed separately so the scope does not silently change. Shared URLs can point to a registry or catalogue; they are not proof of one publication or independent corroboration.

Update canonical research records first, regenerate the research search index if needed, then rebuild this view. The generator records its input hashes. Run `python3 tools/editorial/build_workbench.py --check`, `python3 tools/editorial/test_workbench.py` and `node --test projects/editorial-workbench/workbench.test.mjs` to check data integrity and filtering. These checks do not constitute a browser, language or factual review.

[Operating scope and design notes](../../kb/reference/editorial-workbench.md)
