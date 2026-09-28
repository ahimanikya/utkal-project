# Utkal Store

**Carry a little Odisha.** — proposed store line.

A commercial sub-project of **Utkal Collective**, currently hosted in this shared repository with its own configuration, KB, app and lifecycle. UTS is a provisional working prefix. [Read its complete project KB](kb/index.md).

## Local preview

Node 24 LTS (minimum 22.12), npm 9.6.5 or later. From this folder:

```sh
npm ci
npm run dev
npm run build
npm test
```

The store runs at `http://127.0.0.1:4323/`. The encyclopedia remains a separate app on 4322. Local development currently reuses an ignored dependency link to the site installation; a fresh checkout uses `npm ci` independently. No linked dependencies are committed. The two apps use the same pinned Astro baseline.

Four illustrative product concepts and a saved-selection flow are included. Prices are unset. No orders, payments, customer details or vendor requests are sent. Device-local selections use localStorage and can be removed in the selection page. Four AI-generated Sea & Stone product mockups replace the earlier CSS placeholders. These are concept images, not photographs of manufactured samples. The `/design-review/` page pairs them with outlined vector artwork studies and a downloadable vendor review pack. Odia uses the unmodified Noto Serif Oriya font and its bundled OFL licence.

Root `utkal.config.json` contains this sub-project's settings; `kb/` contains the charter, PRD, role briefs and records. `tools/` preserves the existing Utkal register/catalogue/bundle validation pattern. Run:

```sh
python3 tools/registers.py --check
python3 tools/catalog.py --check
python3 tools/check_bundle.py
```

This is not a separate Git repository or deployment. It is an independently buildable app and project bundle that can move later. The parent Collective's legal form, appointments and separate repository are not established by this starter. No persona memberships are inherited. The [PRD](kb/specs/store-v0.1.md) records the route to live commerce and required vendor inputs.

[Vendor brief](kb/specs/vendor-brief-v1.md) · [Exact image-generation prompts](kb/records/sea-and-stone-prompts.json). The vector studies and mockups differ in detail; reconcile the selected design before sampling.
