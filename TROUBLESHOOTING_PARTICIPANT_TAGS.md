# Troubleshooting: Participants Not Getting "participants-paid" Tag

## Problem

Participants are being created in GHL with tags `['mba lead', 'student']` but **NOT** getting the `participants-paid` tag after payment, so workflows aren't triggering.

## Possible Causes

### 1. Participants Not in Checkout URL ❓

**Check:** When you go to the checkout page, is the URL like this?
```
/checkout-student?email=student@email.com&name=Student&org=PUP&year=1st&participants=p1@email.com,p2@email.com
```

**If NO participants in URL:**
- The issue is in `LeadModal.js` - participants aren't being passed to checkout
- Check browser console during registration for errors

**If YES participants in URL:**
- Continue to #2

### 2. Participants Not Being Sent to API ❓

**Check:** When you click "I've Completed Payment", open browser console (F12) and look for:
```
Sending payment confirmation with payload: {
  email: "...",
  role: "student",
  participantEmails: ["p1@email.com", "p2@email.com"]
}
```

**If participantEmails is empty `[]`:**
- The issue is in `CheckoutStudent.js` - participants aren't being parsed from URL
- Check the logs: "Participants from URL:" and "Parsed participant emails:"

**If participantEmails has emails:**
- Continue to #3

### 3. API Not Receiving Participants ❓

**Check Vercel Logs:** Look for this log in your deployment:
```
Payment success request: {
  email: "...",
  role: "student",
  participantEmails: ["p1@email.com", "p2@email.com"]
}
```

**If participantEmails is missing or empty:**
- The request is being modified somewhere
- Check if there's a proxy or middleware stripping the data

**If participantEmails is present:**
- Continue to #4

### 4. API Not Tagging Participants ❓

**Check Vercel Logs:** Look for these logs:
```
Tagging participants with participants-paid: ["p1@email.com", "p2@email.com"]
Search response status for p1@email.com: 200
Found existing participant p1@email.com with ID: xxx
Successfully added participants-paid tag to p1@email.com
```

**If you see "Participant not found":**
- The participant wasn't created during registration
- Check `api/lead.js` logs to see if participants were created

**If you see "Failed to add tag":**
- There's a GHL API error
- Check the error message for details

**If you DON'T see any participant tagging logs:**
- The condition `if (role === 'student' && Array.isArray(participantEmails) && participantEmails.length > 0)` is failing
- Add more logging to debug

### 5. Wrong Participant Tag Name ❓

**Check:** Are you looking for the right tag in GHL?

The code adds: `participants-paid` (lowercase, with hyphen)

**If you're filtering for:**
- ❌ `Participants Paid` (wrong - has spaces and capitals)
- ❌ `participant-paid` (wrong - singular)
- ✅ `participants-paid` (correct!)

## Quick Tests

### Test 1: Check if API Works Directly

Run this to test the API endpoint directly:
```bash
node test-real-payment-flow.js
```

This will:
- Call the payment-success endpoint with real participant emails
- Show you exactly what's happening
- Tell you if tags were added

### Test 2: Check Browser Console

1. Do a test registration with 2 participants
2. On checkout page, open browser console (F12)
3. Look for these logs:
   ```
   Student Checkout loaded with: {...}
   Participants from URL: "p1@email.com,p2@email.com"
   Parsed participant emails: ["p1@email.com", "p2@email.com"]
   ```
4. Click "I've Completed Payment"
5. Look for:
   ```
   Sending payment confirmation with payload: {...}
   Participant emails being sent: ["p1@email.com", "p2@email.com"]
   ```

### Test 3: Check Vercel Logs

1. Go to Vercel Dashboard → Your Project → Logs
2. Filter by "payment-success"
3. Look for the logs mentioned in sections #3 and #4 above

## Most Likely Issues

Based on your screenshot showing participants with only `mba lead` and `student` tags:

### Issue A: Participants Not in Checkout URL

**Symptom:** URL doesn't have `?participants=...`

**Cause:** Registration form isn't passing participants to checkout

**Fix:** Check `LeadModal.js` line 133-141 - ensure this code is running

### Issue B: User Not Clicking "I've Completed Payment"

**Symptom:** User completes payment on Xendit but doesn't return to your site

**Cause:** User closes Xendit tab or doesn't click the button

**Solution:** Use Xendit webhook instead! The webhook will automatically tag participants when payment is confirmed, even if user doesn't return.

**Check:** Is the webhook configured?
- Xendit Dashboard → Webhooks → Should point to: `https://your-domain.com/api/webhooks/xendit`

### Issue C: Webhook Not Receiving Participant Emails

**Symptom:** Webhook is called but participants aren't tagged

**Cause:** Participant emails aren't in the invoice metadata

**Fix:** Check `api/create-invoice.js` line 94-96:
```javascript
...(participantEmails && participantEmails.length > 0 && {
  participantEmails: JSON.stringify(participantEmails)
})
```

This should be adding participant emails to the invoice metadata.

## Recommended Solution

Since you mentioned workflows aren't triggering, I suspect **Issue B** - users are completing payment on Xendit but not returning to your site to click "I've Completed Payment".

### Solution: Rely on Webhook Instead

The webhook should automatically tag participants when payment is confirmed. Let's verify:

1. **Check if webhook is configured:**
   - Xendit Dashboard → Settings → Webhooks
   - Should have: `https://aihero.millennialbusinessacademy.net/api/webhooks/xendit`

2. **Check webhook logs:**
   - Vercel Dashboard → Logs → Filter by "xendit"
   - Look for: "Tagging participants from webhook"

3. **If webhook isn't working:**
   - Verify webhook URL is correct
   - Verify webhook verification token is set
   - Check webhook logs for errors

## Next Steps

1. ✅ Run `node test-real-payment-flow.js` to test the API directly
2. ✅ Do a test registration and check browser console logs
3. ✅ Check Vercel logs for payment-success and webhook calls
4. ✅ Report back with what you find!

## Expected Final Tags

After successful payment:

**Primary Student:**
```
['MBA Lead', 'student', 'students-paid', 'org:pup', 'year:1st-year-college']
```

**Participants:**
```
['MBA Lead', 'student', 'participant', 'participants-paid']
```

If participants only have `['MBA Lead', 'student']`, it means:
- ✅ They were created during registration
- ❌ They were NOT tagged during payment
- 🔍 Need to debug why payment tagging isn't working

