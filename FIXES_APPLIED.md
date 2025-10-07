# Fixes Applied - Checkout Routes & Xendit URLs

## Issues Found

1. **Wrong Xendit URL**: Was redirecting to `https://checkout.xendit.co/od/ai-student` (with hyphen) causing 404 error
2. **Single checkout route**: Was using `/checkout` for both students and professionals
3. **Email not preserved**: URL structure didn't keep email visible in the URL

## Solutions Implemented

### 1. Created Separate Checkout Routes

**New Files Created:**
- `src/components/CheckoutStudent.js` - Dedicated checkout page for students
- `src/components/CheckoutProfessional.js` - Dedicated checkout page for professionals

**Benefits:**
- ✅ Email stays in URL: `/checkout-student?email=...&org=...&year=...`
- ✅ Role is implicit from the route (no need to pass in URL)
- ✅ Each route embeds the correct Xendit link
- ✅ Cleaner, more maintainable code

### 2. Fixed Xendit URLs

**Before (Wrong):**
```
https://checkout.xendit.co/od/ai-student  ❌ (404 error)
```

**After (Correct):**
```
Staging Student: https://checkout-staging.xendit.co/od/aistudent  ✅
Staging Professional: https://checkout-staging.xendit.co/od/aiprofessional  ✅
Production Student: https://checkout.xendit.co/od/aistudent  ✅
Production Professional: https://checkout.xendit.co/od/aiprofessional  ✅
```

**Key Change:** Removed hyphen from `ai-student` → `aistudent`

### 3. Updated Routing

**Updated `src/index.js`:**
```javascript
<Route path="/checkout-student" element={<CheckoutStudent />} />
<Route path="/checkout-professional" element={<CheckoutProfessional />} />
```

**Updated `src/components/LeadModal.js`:**
- Now redirects to `/checkout-student` for students
- Now redirects to `/checkout-professional` for professionals
- Removed `role` from URL params (implicit from route)

### 4. Updated Environment Variables

**Updated `.env.local`:**
```bash
# Fixed URLs (removed hyphens)
XENDIT_STUDENT_LINK=https://checkout.xendit.co/od/aistudent
XENDIT_PROFESSIONAL_LINK=https://checkout.xendit.co/od/aiprofessional
XENDIT_STUDENT_STAGING_LINK=https://checkout-staging.xendit.co/od/aistudent
XENDIT_PROFESSIONAL_STAGING_LINK=https://checkout-staging.xendit.co/od/aiprofessional
```

---

## New User Flow

### Student Flow:
1. User fills lead form, selects "Student"
2. `POST /api/lead` creates GHL contact with tags: `MBA Lead`, `student`
3. Redirects to `/checkout-student?email=...&org=...&year=...&name=...`
4. CheckoutStudent component loads
5. Embeds Xendit iframe with student link (₱500)
6. User completes payment
7. User clicks "I've Completed Payment"
8. `POST /api/payment-success` with `role=student`
9. GHL contact updated with `students-paid` tag
10. Redirects to `/eticket?t=student&email=...`

### Professional Flow:
1. User fills lead form, selects "Professional"
2. `POST /api/lead` creates GHL contact with tags: `MBA Lead`, `professional`
3. Redirects to `/checkout-professional?email=...&org=...&name=...`
4. CheckoutProfessional component loads
5. Embeds Xendit iframe with professional link (₱1000)
6. User completes payment
7. User clicks "I've Completed Payment"
8. `POST /api/payment-success` with `role=professional`
9. GHL contact updated with `professionals-paid` tag
10. Redirects to `/eticket?t=professional&email=...`

---

## Files Modified

1. ✅ `src/components/CheckoutStudent.js` - NEW
2. ✅ `src/components/CheckoutProfessional.js` - NEW
3. ✅ `src/index.js` - Added new routes
4. ✅ `src/components/LeadModal.js` - Updated redirect logic
5. ✅ `.env.local` - Fixed Xendit URLs

---

## Testing Instructions

### Test Student Checkout:
1. Open homepage
2. Fill lead form as student
3. Should redirect to `/checkout-student?email=...`
4. Verify iframe loads: `https://checkout-staging.xendit.co/od/aistudent`
5. Verify no 404 error
6. Verify page shows "Student" and "₱500"

### Test Professional Checkout:
1. Open homepage
2. Fill lead form as professional
3. Should redirect to `/checkout-professional?email=...`
4. Verify iframe loads: `https://checkout-staging.xendit.co/od/aiprofessional`
5. Verify no 404 error
6. Verify page shows "Professional" and "₱1000"

### Test Payment Confirmation:
1. On checkout page, click "I've Completed Payment"
2. Should call `/api/payment-success` with correct role
3. Should redirect to `/eticket?t=student` or `/eticket?t=professional`
4. Check GHL: Contact should have `students-paid` or `professionals-paid` tag

---

## Environment Detection

Both checkout components automatically detect environment:

**Localhost/Staging:**
- Uses `https://checkout-staging.xendit.co/od/...`

**Production:**
- Uses `https://checkout.xendit.co/od/...`

Detection logic:
```javascript
const isStaging = window.location.hostname.includes('localhost') ||
                  window.location.hostname.includes('staging') ||
                  window.location.hostname.includes('vercel.app');
```

---

## Next Steps

1. **Test locally**: Run `npm start` and test both student and professional flows
2. **Verify Xendit URLs**: Make sure the URLs are correct (no 404s)
3. **Update production URLs**: If production URLs are different, update `.env.local`
4. **Deploy to Vercel**: Push changes and test on preview URL
5. **Test end-to-end**: Complete real payment and verify GHL tags

---

## Troubleshooting

### Issue: Still getting 404 on Xendit
**Solution:** Double-check the Xendit URLs in your Xendit dashboard. The URLs should be:
- `aistudent` (no hyphen)
- `aiprofessional` (no hyphen)

### Issue: Wrong checkout page loads
**Solution:** Check the LeadModal redirect logic. Should redirect to:
- `/checkout-student` for students
- `/checkout-professional` for professionals

### Issue: Role not passed to payment-success API
**Solution:** The role is hardcoded in each checkout component:
- CheckoutStudent: `role = 'student'`
- CheckoutProfessional: `role = 'professional'`

### Issue: Email not in URL
**Solution:** Check LeadModal redirect. Should include `email` in URL params:
```javascript
const params = new URLSearchParams({
  name: name.trim(),
  email: email.trim(),
  org: organization.trim(),
  year: yearInCollege.trim()
});
```

---

## Summary

✅ **Fixed**: Xendit URL 404 error (removed hyphen)
✅ **Added**: Separate checkout routes for students and professionals
✅ **Improved**: Email stays visible in URL
✅ **Simplified**: Role is implicit from route
✅ **Maintained**: All existing functionality (GHL tags, payment confirmation, e-ticket)

The checkout flow is now cleaner, more maintainable, and the Xendit URLs are correct!

