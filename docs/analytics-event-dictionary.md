# Analytics Event Dictionary (Canonical)

## Canonical events
- `page_view`
- `cta_click`
- `plan_card_click`
- `buy_click`
- `checkout_outbound`
- `begin_checkout`
- `lead_submit_attempt`
- `lead_submit_success`
- `lead_submit_error`
- `purchase_thankyou_view`
- `support_click`
- `social_click`

## Legacy aliases
- `nf_buy_click` -> `buy_click`
- `nf_plans_catalog_view` -> `page_view`
- `nf_purchase_thankyou_view` -> `purchase_thankyou_view`
- `nf_lead_submit` -> `lead_submit_success`
- `nf_support_click` -> `support_click`

## Required checkout outbound payload
For Stripe egress, emit `checkout_outbound` with:
- `destination: "stripe"`
- `href`
- `page_path`
- `plan_slug` (if available)
