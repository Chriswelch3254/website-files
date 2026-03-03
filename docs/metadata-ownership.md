# Metadata Ownership Contract

| Metadata | Primary owner | Drift risk | Required rule |
|---|---|---|---|
| `<title>` | Webflow page/CMS fields | Site scripts overwriting title | Scripts may read, never overwrite. |
| `<meta name="description">` | Webflow page/CMS fields | JS mutation creates page mismatch | Scripts may read, never overwrite. |
| `<link rel="canonical">` | Webflow page settings | Runtime script writes conflicting canonical | Canonical is read-only in scripts. |
| Open Graph (`og:*`) | Webflow SEO fields | Partial overrides from snippets | Repo snippets must not mutate OG tags at runtime. |
| Twitter (`twitter:*`) | Webflow SEO fields | Duplicate conflicting tags | Keep single source in Webflow; scripts read only. |
| Org/WebSite JSON-LD | Sitewide snippet | Duplicate append from multiple snippets | Use deterministic script ids and replace-in-place. |
| Article JSON-LD | Blog template snippet | Re-renders appending duplicate nodes | Always upsert by id (`nf-article-jsonld`). |
| Product JSON-LD | Sitewide reviews/schema snippet | Multiple Product nodes + duplicated reviews | Deterministic `@id` (`url#product`), one script node, replace not append. |
| AggregateRating | Sitewide reviews/schema snippet | stale counts or multi-node conflicts | Write into deterministic Product node only. |

## Enforcement rules
1. Canonical URL must not be created/updated by page scripts.
2. JSON-LD scripts must be idempotent (`replaceWith` by id or deterministic match).
3. Product schema must remain singular by deterministic `@id`.
4. Repeated execution must not append duplicate review objects.
