# Manual Webflow Redirects

These redirects are high-confidence legacy mappings discovered during the August 7, 2026 whole-site audit.

Webflow's redirect API is unavailable on the current hosting plan, so these should be added manually in Webflow's Redirects settings when convenient.

| Old path | Destination | Reason |
|---|---|---|
| `/online-training` | `/personal-training` | Published legacy coaching offer replaced by the current Personal Training system. |
| `/1-on-1-training` | `/personal-training` | Historical indexed coaching route; no current Webflow page uses this slug. |
| `/products/untitled-3` | `/training-plans/6-week-speed-power-training-plan` | Historical Webflow Ecommerce URL for the Speed & Power plan. |
| `/products/untitled-5` | `/training-plans/full-body-dynamic-warm-up-routine` | Historical Webflow Ecommerce URL for the Dynamic Warm-Up routine. |
| `/products/untitled-7` | `/training-plans/full-body-static-stretching-routine` | Historical Webflow Ecommerce URL for the Static Stretching routine. |

## Do not guess additional redirects

The August audit did not recover reliable destinations for every possible historical `/products/untitled-*` slug. Do not create a broad wildcard redirect that could send an old product URL to the wrong current product.

Legacy Webflow Checkout, PayPal Checkout, and Order Confirmation utility routes are already contained with noindex. A future redirect for those utilities should be chosen only after confirming the desired recovery experience for old external links.

## Verification after adding redirects

After adding each redirect in Webflow:

1. Publish the site.
2. Open the old path directly in a private/incognito browser session.
3. Confirm a single permanent redirect lands on the intended current destination.
4. Confirm query parameters are preserved when appropriate.
5. Avoid redirect chains.
