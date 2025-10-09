# Debugging Participant Tags Issue

## Summary

The GHL "Add Tags" API endpoint **works correctly** (verified with test script). However, participants are not getting the `participants-paid` tag after payment. This document explains how to debug and fix the issue.

## Test Results

### ✅ What Works
1. **GHL Add Tags API** - Tested with `test-ghl-add-tags.js` and confirmed working
2. **Contact Search API** - Successfully finds contacts by email
3. **Tag Addition** - Tags are successfully added when API is called directly

### ❓ What Needs Investigation
1. Are participant emails being passed in the checkout URL?
2. Are participant emails being sent to the payment-success endpoint?
3. Is the payment-success endpoint actually being called?

## How to Debug

### Step 1: Check Browser Console Logs

After deploying the latest changes, do a test registration with participants:

1. Register as a student with 1-2 participants
2. On the checkout page, open browser console (F12)
3. Look for these logs:

```
Student Checkout loaded with: {email: "...", organization: "...", ...}
Participants from URL: "email1@test.com,email2@test.com"
Parsed participant emails: ["email1@test.com", "email2@test.com"]
```

**If you DON'T see participant emails:**
- The problem is in `LeadModal.js` - participants aren't being passed to the checkout URL
- Check that the registration form is correctly collecting participant emails

**If you DO see participant emails:**
- Continue to Step 2

### Step 2: Check Payment Confirmation Logs

When you click "I've Completed Payment", look for:

```
Sending payment confirmation with payload: {
  email: "...",
  role: "student",
  participantEmails: ["email1@test.com", "email2@test.com"]
}
Participant emails being sent: ["email1@test.com", "email2@test.com"]
```

**If you DON'T see this:**
- The button click handler isn't working
- Check browser console for JavaScript errors

**If you DO see this:**
- Continue to Step 3

### Step 3: Check Server Logs (Vercel)

Go to Vercel Dashboard → Your Project → Logs

Look for these server-side logs:

```
Payment success request: {
  email: "...",
  role: "student",
  participantEmails: ["email1@test.com", "email2@test.com"]
}

Tagging participants with participants-paid: ["email1@test.com", "email2@test.com"]

Search response status for email1@test.com: 200

Search data for email1@test.com: {"contact": {"id": "...", "tags": [...]}}

Found existing participant email1@test.com with ID: xxx, current tags: [...]

Successfully added participants-paid tag to email1@test.com
```

**If you see "Participant not found":**
- The participant wasn't created during registration
- Check `api/lead.js` to ensure participants are being created

**If you see "Failed to add tag":**
- There's an API error
- Check the error message for details (permissions, rate limits, etc.)

**If you DON'T see any participant tagging logs:**
- The `participantEmails` array is empty or not being passed
- Go back to Step 1 and Step 2

## Common Issues & Solutions

### Issue 1: Participants Not in URL
**Symptom:** `Participants from URL:` shows empty string

**Solution:** Check `LeadModal.js` - ensure this code is present:
```javascript
if (role === 'student' && extraParticipants.length > 0) {
  const participantEmails = extraParticipants
    .filter(p => p.email && EMAIL_REGEX.test(p.email))
    .map(p => p.email.trim())
    .join(',');
  if (participantEmails) {
    params.set('participants', participantEmails);
  }
}
```

### Issue 2: Participants Not Created in GHL
**Symptom:** Server logs show "Participant not found in GHL"

**Solution:** Check `api/lead.js` - ensure participants are being created during registration:
```javascript
if (role === 'student' && Array.isArray(participants) && participants.length) {
  // ... creates participants with tags: ['MBA Lead', 'student', 'participant']
}
```

### Issue 3: GHL API Permissions
**Symptom:** Server logs show "401 Unauthorized" or "403 Forbidden"

**Solution:** 
- Check that `GHL_TOKEN` environment variable is set correctly in Vercel
- Ensure the token has `contacts.write` permission
- Verify the token hasn't expired

### Issue 4: Wrong Location ID
**Symptom:** Server logs show "Contact not found" but you can see them in GHL

**Solution:**
- Verify `GHL_LOCATION_ID` environment variable matches your GHL location
- Check in GHL Settings → Business Profile → Location ID

## Manual Testing with Scripts

### Test 1: Verify GHL API Works
```bash
node test-ghl-add-tags.js
```

This tests:
- ✅ Can we search for a contact?
- ✅ Can we add a tag to that contact?
- ✅ Does the tag appear on the contact?

### Test 2: Simulate Payment with Participants
```bash
# First, start your local dev server
npm start

# In another terminal:
node test-payment-with-participants.js
```

This tests:
- ✅ Can we call the payment-success endpoint?
- ✅ Does it accept participantEmails array?
- ✅ Does it tag the participants?

## Expected Flow

```
1. User registers with participants
   ↓
2. api/lead.js creates:
   - Primary contact: ['MBA Lead', 'student']
   - Participants: ['MBA Lead', 'student', 'participant']
   ↓
3. User redirected to checkout with URL:
   /checkout-student?email=...&participants=email1,email2
   ↓
4. User clicks "I've Completed Payment"
   ↓
5. Frontend sends to /api/payment-success:
   {
     email: "primary@email.com",
     role: "student",
     participantEmails: ["email1", "email2"]
   }
   ↓
6. Backend:
   a. Tags primary payer: ['MBA Lead', 'student', 'students-paid']
   b. For each participant:
      - Search for contact by email
      - Add tag: 'participants-paid'
   ↓
7. Result:
   - Primary: ['MBA Lead', 'student', 'students-paid', 'org:...', 'year:...']
   - Participants: ['MBA Lead', 'student', 'participant', 'participants-paid']
```

## Next Steps

1. **Deploy the latest changes** (already done ✅)
2. **Do a test registration** with 1-2 participants
3. **Check browser console** for the logs mentioned in Step 1 & 2
4. **Check Vercel logs** for the server-side logs mentioned in Step 3
5. **Report back** with what you see in the logs

If you see any errors or unexpected behavior, share the logs and we'll debug further!

## Quick Fix: Manual Tagging

If you need to tag existing participants right now while we debug:

1. Go to GHL Contacts
2. Filter by: `student` AND `participant` AND NOT `participants-paid`
3. Select all matching contacts
4. Click "Add Tag" → `participants-paid`

This will manually tag all participants who haven't been tagged yet.

