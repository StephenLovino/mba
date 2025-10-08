# Vercel Production URL Fix

## Problem
Customers completing payment via Xendit were being redirected to Vercel preview URLs (e.g., `mba-git-main-stephenlovino.vercel.app`) instead of the production domain.

## Root Cause
The `getBaseUrl()` function in `api/create-invoice.js` was using `process.env.VERCEL_URL`, which returns the deployment-specific URL (preview URLs for branch deployments) rather than the production domain.

## Solution
Updated the `getBaseUrl()` function to prioritize a `PRODUCTION_URL` environment variable for payment redirects.

## CRITICAL: Action Required

### Step 1: Set Production URL in Vercel Dashboard

1. Go to your Vercel project: https://vercel.com/stephenlovinos-projects/mba
2. Click on **Settings** → **Environment Variables**
3. Add a new environment variable:
   - **Name**: `PRODUCTION_URL`
   - **Value**: Your production domain (e.g., `https://mba.example.com` or `https://your-domain.com`)
   - **Environment**: Select **Production** only (NOT Preview or Development)
4. Click **Save**

### Step 2: Redeploy

After adding the environment variable, you need to trigger a new deployment:
- Option A: Push a new commit (this will happen automatically when you commit these changes)
- Option B: Go to Deployments → Click the three dots on the latest deployment → "Redeploy"

### Step 3: Verify

After deployment:
1. Test the checkout flow
2. Complete a test payment
3. Verify you're redirected to your production domain, not a Vercel preview URL

## What Changed

### Before:
```javascript
function getBaseUrl(req) {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`; // ❌ Returns preview URLs
  }
  // ...
}
```

### After:
```javascript
function getBaseUrl(req) {
  // PRIORITY 1: Use production URL if explicitly set
  if (process.env.PRODUCTION_URL) {
    return process.env.PRODUCTION_URL; // ✅ Returns your production domain
  }
  
  // PRIORITY 2: Check for custom domain from request
  const host = req.headers.host;
  if (host && !host.includes('vercel.app')) {
    const protocol = host.includes('localhost') ? 'http' : 'https';
    return `${protocol}://${host}`;
  }
  
  // PRIORITY 3: Vercel URL (for previews)
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // PRIORITY 4: Local development
  return 'http://localhost:3000';
}
```

## Priority Order

1. **PRODUCTION_URL** env var (set in Vercel) - Used for production deployments
2. **Custom domain from request** - If accessing via custom domain
3. **VERCEL_URL** - For preview deployments
4. **localhost:3000** - For local development

## Important Notes

- The `PRODUCTION_URL` should be set **ONLY** in the Production environment in Vercel
- Preview deployments will still use their preview URLs (which is correct for testing)
- Make sure your production domain is properly configured in Vercel's Domains settings
- After setting the env var, you MUST redeploy for it to take effect

## Testing

To test this works correctly:

1. **Local Testing**: Use localhost (will use fallback)
2. **Preview Testing**: Push to a branch, test with preview URL
3. **Production Testing**: 
   - Complete a real payment
   - Verify redirect goes to your production domain
   - Check the URL in the browser after payment success

## What Your Production URL Should Be

Replace `https://your-production-domain.com` with your actual domain:
- If you have a custom domain: `https://yourdomain.com`
- If using Vercel's domain: `https://mba.vercel.app` (or whatever your production Vercel URL is)
- Do NOT include trailing slashes
- Must include `https://`

## Verification Checklist

- [ ] Added `PRODUCTION_URL` environment variable in Vercel
- [ ] Set it to Production environment only
- [ ] Redeployed the application
- [ ] Tested payment flow
- [ ] Confirmed redirect goes to production domain
- [ ] No more redirects to preview URLs

## If You Don't Have a Custom Domain Yet

If you're still using the default Vercel domain (e.g., `mba.vercel.app`):
1. Find your production deployment URL in Vercel
2. It should be something like `https://mba.vercel.app` or `https://mba-stephenlovino.vercel.app`
3. Use that as your `PRODUCTION_URL`

## Future Considerations

Consider setting up a custom domain for better branding:
1. Purchase a domain (e.g., from Namecheap, GoDaddy, etc.)
2. Add it in Vercel Settings → Domains
3. Update the `PRODUCTION_URL` environment variable to your custom domain

