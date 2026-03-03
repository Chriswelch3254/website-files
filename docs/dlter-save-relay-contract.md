# DLTER Save Relay Contract

This document defines the first-party backend relay contract for DLTER quiz result saves.

## Endpoint

- `POST /api/dlter/save`
- Content-Type: `application/json`

## Request schema

```json
{
  "member_id": "string",
  "type_slug": "string",
  "type_code": "string",
  "quiz_version": "string",
  "client_ts": "string|number",
  "client_nonce": "string",
  "sig": "string (optional)"
}
```

### Field notes

- `member_id`: required, stable Memberstack/member identifier.
- `type_slug`: required, must be one of allowed DLTER slugs.
- `type_code`: optional but recommended for diagnostics.
- `quiz_version`: required for compatibility/rollouts.
- `client_ts`: required Unix timestamp (seconds).
- `client_nonce`: required unique nonce per attempt.
- `sig`: optional at client edge; must be verified server-side if required.

## Response schema

Success:

```json
{ "ok": true }
```

Failure:

```json
{ "ok": false, "error": "missing_member_id|invalid_member_id|invalid_type_slug|invalid_sig|replay_detected|rate_limited|unknown" }
```

## Required server-side validations

1. **`member_id` format**
   - Required, non-empty string.
   - Enforce expected format constraints from identity provider.
2. **`type_slug` allowlist**
   - Validate against canonical DLTER type slug allowlist.
3. **Timestamp window**
   - Reject if `abs(now - client_ts) > REPLAY_WINDOW_SEC`.
4. **Nonce replay protection**
   - Store `(member_id, client_nonce)` with TTL.
   - Reject repeats in active TTL window.
5. **Rate limiting**
   - Enforce per-IP and per-member_id rate limits.
6. **Signature verification (HMAC)**
   - Verify `sig` with server-held secret.
   - Never embed signing secret in client JavaScript.

## Logging fields

Do not log additional PII beyond `member_id`. Log:

- `request_id`
- `member_id`
- `type_slug`
- `type_code`
- `quiz_version`
- `client_ts`
- `client_nonce`
- `has_sig`
- `sig_valid` (boolean/nullable)
- `ip_hash` (preferred over raw IP)
- `user_agent` (sanitized)
- `validation_error` (if any)
- `upstream_target` (`apps_script|db|other`)
- `duration_ms`
- `outcome` (`ok|error`)

## Migration plan

### Phase 1 (relay fronting existing storage)

- Deploy `/api/dlter/save` relay.
- Validate request and enforce replay/rate protections.
- Forward valid records to Apps Script or DB adapter.
- Return canonical `{ok:true}` / `{ok:false,error:"..."}` responses.

### Phase 2 (deprecate Apps Script)

- Move persistence fully to first-party DB/service.
- Remove Apps Script forwarding path.
- Keep response/error contract stable for client compatibility.
