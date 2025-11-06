# Local Development Setup Guide

## 🎯 Overview

To test the **full affiliate flow** (including GoHighLevel contact creation) locally, you need to set up environment variables for the GHL API integration.

---

## 📋 Required Environment Variables

The backend API (`/api/lead.js`) requires these environment variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `GHL_TOKEN` | Your GoHighLevel API token | ✅ Yes |
| `GHL_LOCATION_ID` | Your GoHighLevel location ID | ✅ Yes |
| `GHL_API_BASE` | GHL API base URL | ❌ No (defaults to `https://services.leadconnectorhq.com`) |
| `XENDIT_SECRET_KEY` | Xendit API secret key (for payments) | ✅ Yes (for payment testing) |
| `XENDIT_WEBHOOK_TOKEN` | Xendit webhook verification token | ✅ Yes (for payment testing) |

---

## 🚀 Setup Options

You have **2 options** for local development:

### **Option A: Use `vercel dev` (Recommended)**

This is the easiest way to test locally with production environment variables.

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Link to Your Vercel Project
```bash
vercel link
```

Follow the prompts:
- Set up and deploy? **No**
- Which scope? Select your account
- Link to existing project? **Yes**
- What's the name of your existing project? **mba** (or your project name)

#### Step 3: Pull Environment Variables
```bash
vercel env pull .env.local
```

This downloads all environment variables from your Vercel project to `.env.local`.

#### Step 4: Run Development Server
```bash
vercel dev
```

This will:
- ✅ Start React app on `http://localhost:3000`
- ✅ Run API endpoints locally
- ✅ Use production environment variables
- ✅ Enable full GHL integration testing

#### Step 5: Test Affiliate Flow
```
http://localhost:3000/?ref=zerotoaihero
```

---

### **Option B: Manual `.env.local` Setup**

If you prefer not to use `vercel dev`, you can manually create environment variables.

#### Step 1: Get Your GHL Credentials

**Get GHL API Token:**
1. Log in to GoHighLevel
2. Go to **Settings** → **API**
3. Copy your **API Key**

**Get GHL Location ID:**
1. In GoHighLevel, go to **Settings** → **Business Profile**
2. Copy your **Location ID** (or check the URL: `app.gohighlevel.com/location/{LOCATION_ID}`)

**Get Xendit Credentials:**
1. Log in to Xendit Dashboard
2. Go to **Settings** → **Developers** → **API Keys**
3. Copy your **Secret Key**
4. Go to **Settings** → **Webhooks**
5. Copy your **Webhook Verification Token**

#### Step 2: Create `.env.local` File

Copy the example file:
```bash
cp .env.local.example .env.local
```

#### Step 3: Edit `.env.local`

Open `.env.local` and replace the placeholder values:

```bash
# GoHighLevel API Configuration
GHL_TOKEN=your_actual_ghl_api_token_here
GHL_LOCATION_ID=your_actual_ghl_location_id_here
GHL_API_BASE=https://services.leadconnectorhq.com

# Xendit API Configuration
XENDIT_SECRET_KEY=your_actual_xendit_secret_key_here
XENDIT_WEBHOOK_TOKEN=your_actual_xendit_webhook_token_here
```

#### Step 4: Run with Vercel Dev

Even with manual `.env.local`, you still need to use `vercel dev` to run the API endpoints:

```bash
vercel dev
```

**Note**: `npm start` only runs the React app, not the API endpoints. You need `vercel dev` to run both.

---

## 🧪 Testing the Full Flow

### 1. **Start the Server**
```bash
vercel dev
```

### 2. **Open Affiliate Link**
```
http://localhost:3000/?ref=zerotoaihero
```

### 3. **Check Browser Console**
You should see:
```
Affiliate code captured: zerotoaihero
```

### 4. **Register**
- Click "Register Now"
- Fill out the form
- Submit

### 5. **Check Console Logs**
You should see:
```
Submitting lead: { payload: {...}, apiBase: '', isAffiliate: true }
API Response: { status: 200, data: { created: true, contactId: '...' } }
Affiliate user detected, skipping checkout and going to e-ticket
```

### 6. **Verify in GoHighLevel**
- Go to your GHL account
- Check **Contacts**
- You should see the new contact with tags:
  - `MBA Lead`
  - `student` or `professional`
  - `affiliate_registration`
  - Custom field: `affiliate_code` = `zerotoaihero`

### 7. **Check E-ticket Page**
Should redirect to:
```
http://localhost:3000/eticket?t=student&email=...
```

---

## 🐛 Troubleshooting

### Issue: "GHL configuration missing" Error

**Cause**: Environment variables not loaded

**Solution**:
1. Make sure you're using `vercel dev`, not `npm start`
2. Check that `.env.local` exists and has correct values
3. Restart `vercel dev` after creating/editing `.env.local`

---

### Issue: API Calls Fail with 401 Unauthorized

**Cause**: Invalid GHL API token

**Solution**:
1. Verify your `GHL_TOKEN` is correct
2. Check token hasn't expired
3. Regenerate token in GHL if needed

---

### Issue: Contact Not Created in GHL

**Cause**: Wrong `GHL_LOCATION_ID`

**Solution**:
1. Double-check your Location ID in GHL
2. Make sure you're checking the correct location in GHL

---

### Issue: "Cannot GET /api/lead" Error

**Cause**: API endpoints not running

**Solution**:
- Use `vercel dev` instead of `npm start`
- `npm start` only runs React, not API endpoints

---

## 📊 What Works Without Environment Variables

| Feature | `npm start` | `vercel dev` (no env) | `vercel dev` (with env) |
|---------|-------------|----------------------|------------------------|
| Frontend affiliate detection | ✅ Yes | ✅ Yes | ✅ Yes |
| Redirect to e-ticket | ✅ Yes | ✅ Yes | ✅ Yes |
| GHL contact creation | ❌ No | ❌ No | ✅ Yes |
| Affiliate tags in GHL | ❌ No | ❌ No | ✅ Yes |
| Email workflow trigger | ❌ No | ❌ No | ✅ Yes |
| Payment processing | ❌ No | ❌ No | ✅ Yes |

---

## 🔒 Security Notes

1. **Never commit `.env.local`** - It's already in `.gitignore`
2. **Don't share your API tokens** - Keep them secret
3. **Use different tokens** for development and production (if possible)
4. **Rotate tokens regularly** for security

---

## 📝 Quick Reference

### Start Development Server
```bash
vercel dev
```

### Test Affiliate Link
```
http://localhost:3000/?ref=zerotoaihero
```

### Check Environment Variables
```bash
cat .env.local
```

### Pull Latest Env Vars from Vercel
```bash
vercel env pull .env.local
```

---

## 🎯 Summary

**For Frontend Testing Only** (affiliate detection, redirect):
- Use `npm start`
- No environment variables needed
- GHL integration won't work

**For Full Flow Testing** (including GHL):
- Use `vercel dev`
- Set up `.env.local` with GHL credentials
- Full integration works

---

## 📞 Need Help?

If you're still having issues:

1. Check the browser console for errors
2. Check the terminal running `vercel dev` for API errors
3. Verify your GHL credentials are correct
4. Make sure you're using `vercel dev`, not `npm start`

---

**Last Updated**: November 6, 2025  
**Status**: ✅ Complete

