---
type: "Project record"
title: "Project identity"
---

# Project identity

The repository-root `utkal.config.json` distinguishes this operating instance. Human authority remains with Ahimanikya Satapathy.

Record status, OKF document type and human approval are distinct. A named persona definition is not an active assignment.

Configuration is an input to repository tooling and is outside this knowledge bundle. The actual team and governance records remain readable here. See [repository boundaries](repository-layout.md).

## Website domain

On 28 September 2026, Ahimanikya Satapathy reported: “I have utkalproject.org now”, and identified GoDaddy as the registrar. Record this as Founder-reported acquisition; account ownership, expiry and DNS have not been independently verified. The selected website domain is `utkalproject.org`.

Cloudflare Pages with Cloudflare DNS is the proposed hosting route for the existing static Astro site. Registration can remain at GoDaddy. Connecting the apex domain to Pages requires a Cloudflare zone and the exact assigned Cloudflare nameservers at the registrar. Preserve any existing mail and verification records when migrating DNS. See [Cloudflare custom-domain instructions](https://developers.cloudflare.com/pages/configuration/custom-domains/).

Next: confirm the hosting choice, inspect the current DNS and prepare a reviewed public build. Registration does not mean the site is deployed. No DNS, hosting, email or publication settings were changed by this record.

### Applied GitHub Pages configuration

The Founder subsequently chose GitHub Pages and authorized “ok make it public”. Browser evidence confirmed `ahimanikya/utkal-project` is public, Pages uses GitHub Actions, and its custom domain is `utkalproject.org`. This supersedes the earlier Cloudflare hosting proposal for the encyclopedia. Utkal Blueprint was not changed.

GoDaddy now has four A records at `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` (600-second TTL), plus `www` CNAME to `ahimanikya.github.io` (one-hour TTL). The parked A record and former `www` alias were replaced; nameservers, SOA, domain-connect and DMARC records were preserved. At configuration time GitHub had requested its TLS certificate; HTTPS enforcement and first deployment still needed verification. The current domain expiry shown by GoDaddy is 28 September 2027, with renewal displayed as USD 23.99/year; this registrar-specific price supersedes the earlier illustrative Porkbun quote.

A manual Astro deployment workflow is prepared for a Founder-approved main-branch release. Configuring the connection has not deployed the site or merged the website review branch.
