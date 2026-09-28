# Utkal Project website

**Rediscover Utkal. Reimagine Odisha.**

An Astro static website and brand review studio. This is a local review edition; its articles, refined logo and new artwork await Founder review. There is no deployment workflow or public submission endpoint.

## Run locally

Use Node 24 LTS (`.nvmrc`; dependency minimum 22.12) and npm 9.6.5 or later. From this directory:

```sh
npm ci
npm run dev
```

Open `http://127.0.0.1:4322/`. The brand choices are at `/brand-review/`. The development server binds to loopback only. With this version of Astro, `npx astro dev status`, `npx astro dev logs` and `npx astro dev stop` manage its local background server.

```sh
npm run build
npm test
npm run preview
```

Build before running the tests. Build output is in `dist/`. Generated content, dependencies and build output are ignored by Git. `ASTRO_TELEMETRY_DISABLED=1` can be set for local commands.

## What is included

- Homepage, about and contribution guidance.
- Searchable collection of six entries with topic links and shareable query URLs.
- Existing Samanta Chandrasekhar article, retaining its source and review limitations.
- Five short research notes selected from the project KB at build time.
- Three English–Odia identity treatments, a working palette and new AI-assisted artwork.
- Local Noto Odia fonts with their original licences.

The project KB remains the source for research. `tools/select-content.mjs` explicitly selects five files; it does not publish the full KB, governance records or private contributor information. Adding a preview entry to this list is not editorial publication approval. Website code, build settings and public assets stay here; repository configuration stays at the root.

## Review and publication

See the [website brief](../../kb/specs/website-brand-foundation.md), [brand proposal](../../kb/reference/brand-foundation.md), [asset provenance and prompts](../../kb/records/brand-foundation-assets.json) and [verification record](../../kb/records/website-brand-checks.json).

`noindex` and `robots.txt` describe a review edition; they are not access controls. Keep deployment private until its content and publication are approved. GitHub project-path hosting will require an explicit base-path configuration or a domain-root deployment; current links assume the domain root.

Deferred: Firebase accounts/intake, photo uploads, Google Analytics, AI chat, a final vector logo master, share-card exports and public launch. No API keys or paid services are needed to review this version locally. Hosting and domain arrangements remain separate decisions.

The earlier standalone preview is preserved locally. This site brings its article, pinned dependencies and useful colour/font assets into the canonical repository, then adds the collection and branding work.
