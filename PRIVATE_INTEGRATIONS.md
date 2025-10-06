# Private Integrations Setup (GHL + Xendit)

This app uses Vercel serverless functions to sync leads to GHL and process Xendit webhooks. No database is required for the basic flow.

## Environment variables

Set these in your local `.env` (for `vercel dev`) and in Vercel Project Settings → Environment Variables.

Required:
- `GHL_LOCATION_ID`: GHL subaccount/location ID to store contacts
- `XENDIT_STUDENT_LINK`: Payment link for students
- `XENDIT_PROFESSIONAL_LINK`: Payment link for professionals

One of the following for GHL auth:
- `PRIVATE_GHL_PROXY_URL`: Your own secure proxy that talks to GHL (preferred)
  - or -
- `GHL_API_BASE` and `GHL_API_KEY`: Direct GHL API base and key

Webhook verification:
- `XENDIT_WEBHOOK_TOKEN`: Shared secret (x-callback-token) for Xendit callbacks

## Local development

1. Create `.env.local` at the project root:
```bash
GHL_LOCATION_ID=xxxxxxxx
XENDIT_STUDENT_LINK=https://checkout-student
XENDIT_PROFESSIONAL_LINK=https://checkout-pro
PRIVATE_GHL_PROXY_URL=https://your-proxy.example.com
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
- Server syncs to GHL and returns the appropriate Xendit link; frontend redirects.
- Xendit calls `POST /api/webhooks/xendit` on payment; server updates contact in GHL.

## Notes

- Keep secrets server-side only. Do not expose keys in the browser.
- If rate limits or retries occur, the API handlers are lightweight and safe to retry.
- You can switch from `PRIVATE_GHL_PROXY_URL` to direct `GHL_API_BASE` + `GHL_API_KEY` without code changes.


