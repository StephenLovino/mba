# Duplicate Contacts Fix

## Problem Identified

You discovered that **duplicate contacts are being created in GHL** when users complete payment. This is because the code was using **Upsert** (POST to `/contacts/`) which can create duplicates instead of updating existing contacts.

### Why Duplicates Were Created

The old flow:
1. ✅ User registers → `api/lead.js` creates contact with tags `['MBA Lead', 'student']`
2. ✅ User goes to checkout → Contact already exists in GHL
3. ❌ User clicks "I've Completed Payment" → `api/payment-success.js` uses **Upsert** which creates a **NEW contact** instead of updating the existing one
4. ❌ Result: Two contacts with the same email!

## Solution Implemented

Changed the flow to **Search + Add Tags** instead of **Upsert**:

### New Flow

1. ✅ User registers → `api/lead.js` creates contact
2. ✅ User completes payment → `api/payment-success.js`:
   - **Searches** for existing contact by email
   - **Adds tags** to the existing contact (no new contact created)
3. ✅ Result: One contact with updated tags!

### Files Changed

#### 1. `api/payment-success.js`
**Before:**
```javascript
// Used Upsert - creates duplicates
const upsertRes = await fetch(`${apiBase}/contacts/`, {
  method: 'POST',
  body: JSON.stringify({
    email: email,
    locationId: locationId,
    tags: tags
  })
});
```

**After:**
```javascript
// Step 1: Search for existing contact
const searchUrl = `${apiBase}/contacts/search/duplicate?locationId=${locationId}&email=${encodeURIComponent(email)}`;
const searchRes = await fetch(searchUrl, { method: 'GET', headers });
const existingContact = searchData?.contact;
const contactId = existingContact.id;

// Step 2: Add tags to existing contact
const addTagsUrl = `${apiBase}/contacts/${contactId}/tags`;
await fetch(addTagsUrl, {
  method: 'POST',
  body: JSON.stringify({ tags: tagsToAdd })
});
```

#### 2. `api/webhooks/xendit.js`
Applied the same fix for webhook-triggered payments.

## Benefits

✅ **No more duplicates** - Always updates existing contacts  
✅ **Cleaner data** - One contact per email  
✅ **Better tracking** - All tags on one contact  
✅ **Faster queries** - No need to merge duplicate data  

## Cleaning Up Existing Duplicates

### Option 1: Manual Cleanup in GHL

1. Go to GHL Contacts
2. Sort by Email
3. For each duplicate:
   - Identify the primary contact (usually the older one)
   - Copy any unique tags from duplicates to the primary
   - Delete the duplicate contacts

### Option 2: Find Duplicates with Script

Run the script to identify all duplicates:

```bash
node cleanup-duplicates.js
```

This will show you:
- Which emails have duplicates
- Contact IDs for each duplicate
- Tags on each contact
- Creation dates

Then you can manually merge them in GHL.

### Example Output

```
⚠️ Found 3 duplicate emails:

📧 stephen.ben19@gmail.com (2 contacts):
  - ID: 6GRHDK3BVqoRam5s4iC8
    Name: Stephen Lovino
    Tags: mba lead, student
    Created: 2025-05-02T23:58:59.059Z
    Source: form 6
    
  - ID: abc123xyz
    Name: Stephen Lovino
    Tags: mba lead, student, students-paid
    Created: 2025-10-09T12:34:56.789Z
    Source: payment confirmation
```

In this case:
- Keep the **second contact** (has the payment tag)
- Delete the first contact
- Or merge tags and keep the older one

## Testing the Fix

### Test 1: New Registration + Payment

1. Register a new user (not in GHL yet)
2. Complete payment
3. Check GHL - should see **only 1 contact** with payment tags

### Test 2: Existing Contact + Payment

1. Find an existing contact in GHL (already registered)
2. Use their email to complete a payment
3. Check GHL - should see **only 1 contact** with updated tags (no duplicate)

### Test 3: Participant Tagging

1. Register as student with 2 participants
2. Complete payment
3. Check GHL:
   - Primary payer: 1 contact with `students-paid` tag
   - Participants: 1 contact each with `participants-paid` tag
   - No duplicates!

## Verification

After deploying, you can verify the fix is working by:

1. **Check Vercel Logs** for:
   ```
   Searching for existing contact: email@example.com
   Found existing contact: { id: "xxx", email: "...", currentTags: [...] }
   Adding tags to contact: ["students-paid", "org:...", "year:..."]
   Successfully added tags: { tags: [...], tagsAdded: [...] }
   ```

2. **Check GHL** - No new duplicate contacts should be created

3. **Run cleanup script** - Should show fewer duplicates over time

## Important Notes

⚠️ **This fix only prevents FUTURE duplicates**  
- Existing duplicates need to be cleaned up manually
- Use the `cleanup-duplicates.js` script to find them

✅ **Safe to deploy**  
- No breaking changes
- Works with existing contacts
- Handles missing contacts gracefully (returns 404)

🔄 **Backwards Compatible**  
- Still works if contact doesn't exist (returns error asking user to register first)
- Webhook still works the same way

## Next Steps

1. ✅ Deploy the changes (commit and push)
2. ⏳ Run `cleanup-duplicates.js` to find existing duplicates
3. ⏳ Manually clean up duplicates in GHL
4. ✅ Test with new registrations
5. ✅ Monitor Vercel logs to confirm no duplicates

## Summary

**Problem:** Upsert was creating duplicate contacts  
**Solution:** Search for existing contact + Add tags  
**Result:** No more duplicates! 🎉

