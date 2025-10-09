# Testing Participant Tagging Fix

## The Problem
Previously, when participants were tagged after payment, the GHL API was **replacing** their existing tags instead of **adding** the new `participants-paid` tag to their existing tags.

## The Solution
Now we:
1. **Search** for the existing contact by email
2. **Fetch** their current tags
3. **Merge** the new tag with existing tags (using Set to avoid duplicates)
4. **Update** the contact with the merged tags

## How to Test

### Step 1: Register a Student with Participants
1. Go to your registration page
2. Fill in student information
3. Add 1-2 participants with valid email addresses
4. Complete the registration

### Step 2: Check Initial Tags in GHL
Before payment, participants should have:
- ✅ `MBA Lead`
- ✅ `student`
- ✅ `participant`

### Step 3: Complete Payment
1. Go through the checkout process
2. Complete the payment (or click "I've Completed Payment")

### Step 4: Verify Tags After Payment

#### Primary Payer Should Have:
- ✅ `MBA Lead`
- ✅ `student`
- ✅ `students-paid`
- ✅ `org:university-name` (if provided)
- ✅ `year:1st-year` (if provided)

#### Participants Should Have:
- ✅ `MBA Lead`
- ✅ `student`
- ✅ `participant`
- ✅ `participants-paid` ← **This should now appear!**

## What Changed in the Code

### Before (Incorrect)
```javascript
// This REPLACED all tags
const participantUpsertRes = await fetch(`${apiBase}/contacts/`, {
  method: 'POST',
  body: JSON.stringify({
    email: participantEmail.trim(),
    tags: ['MBA Lead', 'student', 'participant', 'participants-paid']
  })
});
```

### After (Correct)
```javascript
// Step 1: Search for existing contact
const searchUrl = `${apiBase}/contacts/search/duplicate?locationId=${locationId}&email=${email}`;
const searchRes = await fetch(searchUrl, { method: 'GET', headers });
const existingContact = searchData?.contact;
const existingTags = existingContact?.tags || [];

// Step 2: Merge tags (no duplicates)
const newTags = [...new Set([...existingTags, 'participants-paid'])];

// Step 3: Update existing contact
const updateUrl = `${apiBase}/contacts/${contactId}`;
await fetch(updateUrl, {
  method: 'PUT',
  body: JSON.stringify({ tags: newTags })
});
```

## Files Updated
1. ✅ `api/payment-success.js` - Fixed participant tagging on manual confirmation
2. ✅ `api/webhooks/xendit.js` - Fixed participant tagging on webhook confirmation

## Debugging

If participants still don't get the `participants-paid` tag, check the logs:

### In Vercel Logs (or your deployment platform):
Look for these log messages:
```
Tagging participants with participants-paid: [email1, email2]
Found existing participant email@example.com with tags: ['MBA Lead', 'student', 'participant']
Updating participant email@example.com with merged tags: ['MBA Lead', 'student', 'participant', 'participants-paid']
Successfully updated participant email@example.com with participants-paid tag
```

### Common Issues:

1. **Participant emails not being passed**
   - Check URL parameters in checkout page
   - Should see `?participants=email1@test.com,email2@test.com`

2. **GHL API permissions**
   - Ensure your GHL token has permission to update contacts
   - Check that the location ID is correct

3. **Contact not found**
   - The search API might not find the contact immediately
   - Try waiting a few seconds and manually triggering the payment confirmation again

## Manual Fix (If Needed)

If you need to manually tag existing participants:

1. Go to GHL Contacts
2. Filter by tag: `participant` AND NOT `participants-paid`
3. Bulk select all
4. Add tag: `participants-paid`

## Next Steps

After confirming this works:
1. ✅ Set up your GHL workflow to trigger on `participants-paid` tag
2. ✅ Test the workflow with a real participant
3. ✅ Monitor the first few real registrations to ensure it's working

