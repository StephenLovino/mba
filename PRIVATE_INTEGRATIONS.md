# Private Integrations Setup (GHL + Xendit)

This app uses Vercel serverless functions to sync leads to GHL and process Xendit webhooks. No database is required for the basic flow.

## Environment variables

Set these in your local `.env` (for `vercel dev`) and in Vercel Project Settings → Environment Variables.

Required:
- `GHL_LOCATION_ID`: GHL subaccount/location ID to store contacts/opportunities
- `XENDIT_STUDENT_LINK`: Payment link for students
- `XENDIT_PROFESSIONAL_LINK`: Payment link for professionals

GHL auth (choose one):
- Direct Private Integration token (recommended):
  - `GHL_TOKEN`: Private Integration token from the intended Location
  - `GHL_API_BASE` (optional, defaults to `https://services.leadconnectorhq.com`)
- Via your own proxy:
  - `PRIVATE_GHL_PROXY_URL`: Your proxy that forwards to GHL

Webhook verification:
- `XENDIT_WEBHOOK_TOKEN`: Shared secret (x-callback-token) for Xendit callbacks

Opportunities (optional):
- `GHL_PIPELINE_ID`: Pipeline to create an opportunity in
- `GHL_PIPELINE_STAGE_ID`: Stage ID (optional)
- `PRICE_STUDENT` / `PRICE_PROFESSIONAL`: Used for `monetaryValue` if set

## Local development

1. Create `.env.local` at the project root:
```bash
GHL_LOCATION_ID=xxxxxxxx
GHL_TOKEN=your-private-integration-token
GHL_PIPELINE_ID=VDm7RPYC2GLUvdpKmBfC
# GHL_PIPELINE_STAGE_ID=optional-stage
PRICE_STUDENT=500
PRICE_PROFESSIONAL=1000

XENDIT_STUDENT_LINK=https://checkout-student
XENDIT_PROFESSIONAL_LINK=https://checkout-pro
XENDIT_WEBHOOK_TOKEN=your-webhook-token
```

2. Run locally:
- Use `vercel dev` to run `api/` routes.
- Or deploy to Vercel and test via preview URL.

3. To receive Xendit webhooks locally, expose a tunnel (e.g., `ngrok http 3000`) and set the webhook URL to `http(s)://<host>/api/webhooks/xendit`.

## Vercel deployment

- Add the same env vars in Vercel (Production + Preview as needed).
- Deploy; verify `POST /api/lead` and `POST /api/webhooks/xendit` are accessible.

## Data flow

- Frontend opens a multi-step modal from any CTA.
- Submit hits `POST /api/lead` with `{ name, email, role, utms }`.
- Server creates/updates Contact with tags (e.g., `MBA Lead`, `student`/`professional`) and returns the appropriate Xendit link; frontend redirects.
- Optional: If `GHL_PIPELINE_ID` is configured, the server will also create an Opportunity. If you prefer to create opportunities in GHL Workflows based on tags, simply leave `GHL_PIPELINE_ID` unset.

## Recommended approach

For simplicity and maximum control in GHL:
1. Let the site create Contact + tags only.
2. In GHL, build a Workflow that triggers on tag added (e.g., `MBA Lead` + role) and creates the Opportunity in the correct Pipeline/Stage.

This keeps logic centralized in GHL and allows easy changes to routing without code updates.
- Xendit calls `POST /api/webhooks/xendit` on payment; server updates contact in GHL.

## Notes

- Keep secrets server-side only. Do not expose keys in the browser.
- If rate limits or retries occur, the API handlers are lightweight and safe to retry.
- You can switch from `PRIVATE_GHL_PROXY_URL` to direct `GHL_API_BASE` + `GHL_API_KEY` without code changes.


