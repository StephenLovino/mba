# Private Integrations Setup (GHL + Xendit)

This app uses Vercel serverless functions to sync leads to GHL. Due to Xendit API/webhook limitations (OTP bug), we use **static multiple payment links** embedded in iframes with manual payment confirmation.

## ⚠️ Current Workaround (No Xendit API/Webhooks)

Since Xendit API is unavailable due to OTP issues, the flow is:
1. User fills lead form → Creates GHL contact with tags (`MBA Lead`, `student`/`professional`)
2. User redirects to `/checkout` with embedded Xendit static payment link iframe
3. User completes payment in iframe
4. User clicks "I've Completed Payment" button
5. System calls `/api/payment-success` to add `students-paid` or `professionals-paid` tag
6. User redirects to `/eticket` page
7. GHL workflow triggers email based on paid tags

## Environment variables

Set these in your local `.env.local` (for `vercel dev`) and in Vercel Project Settings → Environment Variables.

Required:
- `GHL_LOCATION_ID`: GHL subaccount/location ID to store contacts/opportunities
- `GHL_TOKEN`: Private Integration token from the intended Location
- `XENDIT_STUDENT_LINK`: Static payment link for students (production)
- `XENDIT_PROFESSIONAL_LINK`: Static payment link for professionals (production)
- `XENDIT_STUDENT_STAGING_LINK`: Static payment link for students (staging/testing)
- `XENDIT_PROFESSIONAL_STAGING_LINK`: Static payment link for professionals (staging/testing)
- `PRICE_STUDENT`: Price for students (e.g., 500)
- `PRICE_PROFESSIONAL`: Price for professionals (e.g., 1000)

Optional:
- `GHL_API_BASE`: GHL API base URL (defaults to `https://services.leadconnectorhq.com`)
- `GHL_PIPELINE_ID`: Pipeline to create an opportunity in (if you want opportunities created via API)
- `GHL_PIPELINE_STAGE_ID`: Stage ID (optional)
- `REACT_APP_API_BASE`: For local React dev server to point to Vercel preview URL

Not currently used (for future when Xendit API is available):
- `XENDIT_WEBHOOK_TOKEN`: Shared secret (x-callback-token) for Xendit callbacks
- `PRIVATE_GHL_PROXY_URL`: Your proxy that forwards to GHL

## Local development

1. Create `.env.local` at the project root:
```bash
GHL_LOCATION_ID=bbfZjbxapaQ2U2ocMVlA
GHL_TOKEN=pit-1cbdceab-07fc-4c0d-a5b7-b55ab87b5074

# Production Xendit Links
XENDIT_STUDENT_LINK=https://checkout.xendit.co/od/student
XENDIT_PROFESSIONAL_LINK=https://checkout.xendit.co/od/professionals

# Staging Xendit Links (for testing)
XENDIT_STUDENT_STAGING_LINK=https://checkout-staging.xendit.co/od/aistudent
XENDIT_PROFESSIONAL_STAGING_LINK=https://checkout-staging.xendit.co/od/aiprofessional

# Pricing
PRICE_STUDENT=500
PRICE_PROFESSIONAL=1000

# Optional: For local React dev server, point API to your Vercel preview URL
# REACT_APP_API_BASE=https://<your-vercel-deployment>.vercel.app
```

2. Run locally:
- Option A (recommended): `npm start` for React dev server on localhost:3000
- Option B: Deploy to Vercel and test via preview URL
- Option C: Run `vercel dev` locally to serve both React and `api/` routes

3. Test the flow:
- Fill out lead form → Should create GHL contact
- Click checkout → Should show embedded Xendit iframe (staging link on localhost)
- Complete payment in iframe
- Click "I've Completed Payment" → Should add paid tag and redirect to e-ticket

## Vercel deployment

1. Add all env vars in Vercel Project Settings → Environment Variables (Production + Preview)
2. Deploy to Vercel
3. Verify endpoints:
   - `POST /api/lead` - Creates GHL contact and returns checkout URL
   - `POST /api/payment-success` - Updates GHL contact with paid tags

## Data flow (Current Workaround)

### Lead Capture Flow:
1. User clicks CTA → Opens multi-step modal (LeadModal)
2. User fills: name, email, role (student/professional), organization, year
3. Submit hits `POST /api/lead` with `{ name, email, role, organization, yearInCollege, utms }`
4. Server creates/updates GHL Contact with tags:
   - `MBA Lead`
   - `student` or `professional`
   - `org:organization-name` (if provided)
   - `year:year-in-college` (if provided)
5. Frontend redirects to `/checkout?email=...&role=...&org=...&year=...&name=...`

### Payment Flow:
6. Checkout page embeds Xendit static payment link iframe (role-based: student or professional)
7. User completes payment in iframe
8. User clicks "I've Completed Payment - Get My E-Ticket" button
9. Frontend calls `POST /api/payment-success` with `{ email, role, organization, yearInCollege }`
10. Server updates GHL Contact, adding paid tag:
    - `students-paid` (for students)
    - `professionals-paid` (for professionals)
11. Frontend redirects to `/eticket?t=role&email=...&org=...&year=...`
12. E-ticket page shows success message

### GHL Workflow (Recommended):
13. In GHL, create Workflow triggered by tag added:
    - Trigger: Tag `students-paid` or `professionals-paid` added
    - Action: Send email with webinar details
    - Optional: Create Opportunity in Pipeline

## Recommended GHL Setup

For simplicity and maximum control:
1. Let the site create Contact + tags only (no opportunities via API)
2. In GHL, build Workflows that trigger on tags:
   - **Lead Workflow**: Tag `MBA Lead` + role → Send welcome email, create opportunity
   - **Payment Workflow**: Tag `students-paid` or `professionals-paid` → Send webinar details email, update opportunity stage

This keeps logic centralized in GHL and allows easy changes without code updates.

## Future: When Xendit API is Available

When Xendit fixes the OTP bug and API access is restored:
1. Update `/api/lead` to use Xendit API to create payment invoices
2. Implement `/api/webhooks/xendit` to handle payment callbacks
3. Remove manual "I've Completed Payment" button
4. Auto-redirect from Xendit to e-ticket page after payment

## Notes

- Keep secrets server-side only. Do not expose keys in the browser.
- Email is used as the unique identifier to update contacts (GHL upsert by email)
- If rate limits occur, the API handlers are lightweight and safe to retry.
- The checkout iframe uses staging links on localhost/staging, production links on production domain.


