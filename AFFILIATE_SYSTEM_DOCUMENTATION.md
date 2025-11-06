# Affiliate System Documentation

## ✅ System Overview

A simple affiliate link system that allows users to bypass payment and get free access to the MBA webinar when they use a valid affiliate link.

---

## 🎯 How It Works

### User Flow:

1. **User visits site with affiliate link**: `https://aihero.millennialbusinessacademy.net/?ref=zerotoaihero`
2. **Affiliate code is captured** and stored in sessionStorage
3. **User clicks "Register Now"** → LeadModal opens
4. **User fills out registration form** (name, email, role, etc.)
5. **User submits form** → Data sent to GHL API
6. **System detects affiliate user** → Skips Xendit checkout
7. **User redirected to E-ticket page** → Same as paid users
8. **GHL tags applied**:
   - Same tags as paid users: `students-paid` or `professionals-paid` (triggers email workflow)
   - Additional tag: `affiliate_registration` (identifies affiliate users)
   - Custom field: `affiliate_code` = `zerotoaihero`

---

## 🔑 Valid Affiliate Codes

Currently, only **one** affiliate code is valid:

- `zerotoaihero` (case-insensitive)

### Example URLs:
- `https://aihero.millennialbusinessacademy.net/?ref=zerotoaihero`
- `https://aihero.millennialbusinessacademy.net/?ref=ZEROTOAIHERO` (also works)

---

## 📋 Implementation Details

### Files Modified:

#### 1. **`src/utils/affiliateTracking.js`** (NEW)
Utility functions for affiliate tracking:
- `captureAffiliateCode()` - Captures `?ref=` from URL and stores in sessionStorage
- `getAffiliateCode()` - Retrieves stored affiliate code
- `isAffiliateUser()` - Checks if user came via affiliate link
- `clearAffiliateCode()` - Clears affiliate code from storage

#### 2. **`src/App.js`**
- Added `useEffect` to capture affiliate code on page load
- Imports `captureAffiliateCode` from affiliateTracking utility

#### 3. **`src/components/LeadModal.js`**
- Imports affiliate tracking functions
- Checks if user is affiliate in `submit()` function
- Adds `affiliateCode` and `isAffiliate` to API payload
- **Affiliate users**: Redirects to `/eticket?t=role&email=...&org=...&year=...` (skips checkout)
- **Regular users**: Redirects to `/checkout-student` or `/checkout-professional`

#### 4. **`api/lead.js`**
- Accepts `affiliateCode` and `isAffiliate` from request body
- Adds `affiliate_registration` tag if user is affiliate
- Stores affiliate code in GHL custom field `affiliate_code`
- Logs affiliate user creation for tracking

#### 5. **`src/routes/Eticket.js`**
- Receives affiliate users same as paid users
- Calls `/api/payment-success` endpoint (adds paid tags)
- Shows e-ticket image for download
- Both affiliate and paid users get same email workflow

---

## 🏷️ GoHighLevel Tags

### Tags Applied to ALL Users (Paid + Affiliate):
- `MBA Lead` - Base tag for all leads
- `student` or `professional` - Role-based tag
- `students-paid` or `professionals-paid` - **Triggers email workflow**
- `org:company-name` - Organization tag (if provided)
- `year:sophomore` - Year in college tag (if student)

### Additional Tags for Affiliate Users:
- `affiliate_registration` - Identifies user came via affiliate link

### Custom Fields for Affiliate Users:
- `affiliate_code` = `zerotoaihero` - Stores which affiliate code was used

---

## 🔄 Flow Comparison

### Regular Paid User Flow:
```
1. User visits site
2. Clicks "Register Now"
3. Fills out LeadModal form
4. Submits → GHL contact created with tags: [MBA Lead, role]
5. Redirects to /checkout-student or /checkout-professional
6. Completes Xendit payment
7. Redirects to /success?email=...&role=...
8. Success page calls /api/payment-success
9. GHL adds tag: students-paid or professionals-paid
10. Email workflow triggered ✅
```

### Affiliate User Flow:
```
1. User visits site with ?ref=zerotoaihero
2. Affiliate code captured and stored
3. Clicks "Register Now"
4. Fills out LeadModal form
5. Submits → GHL contact created with tags: [MBA Lead, role, affiliate_registration]
6. System detects affiliate → SKIPS checkout
7. Redirects to /eticket?t=role&email=...&org=...&year=...
8. E-ticket page calls /api/payment-success
9. GHL adds tag: students-paid or professionals-paid
10. E-ticket displayed for download
11. Email workflow triggered ✅
```

**Key Difference**: Affiliate users skip steps 5-6 (Xendit payment) but still get the same paid tags, e-ticket, and email workflow.

---

## 🧪 Testing

### Test Affiliate Link:
```
https://aihero.millennialbusinessacademy.net/?ref=zerotoaihero
```

### Expected Behavior:
1. ✅ Open link in browser
2. ✅ Check browser console: Should see "Affiliate code captured: zerotoaihero"
3. ✅ Click "Register Now"
4. ✅ Fill out form and submit
5. ✅ Should redirect to E-ticket page (NOT checkout page)
6. ✅ E-ticket page should show ticket image and download button
7. ✅ Check GHL contact:
   - Should have tags: `MBA Lead`, `student`/`professional`, `students-paid`/`professionals-paid`, `affiliate_registration`
   - Should have custom field: `affiliate_code` = `zerotoaihero`

### Test Regular Flow (No Affiliate):
```
https://aihero.millennialbusinessacademy.net/
```

### Expected Behavior:
1. ✅ Open link in browser
2. ✅ Click "Register Now"
3. ✅ Fill out form and submit
4. ✅ Should redirect to Checkout page (Xendit payment)
5. ✅ Complete payment
6. ✅ Redirects to Success page
7. ✅ Check GHL contact:
   - Should have tags: `MBA Lead`, `student`/`professional`, `students-paid`/`professionals-paid`
   - Should NOT have `affiliate_registration` tag

---

## 🔧 Adding More Affiliate Codes

To add more affiliate codes, edit `src/utils/affiliateTracking.js`:

```javascript
const VALID_AFFILIATE_CODES = [
  'zerotoaihero',
  'newaffiliate123',  // Add new codes here
  'partner2025'
];
```

---

## 📊 Tracking & Analytics

### How to Track Affiliate Performance:

1. **In GoHighLevel**:
   - Filter contacts by tag: `affiliate_registration`
   - View custom field: `affiliate_code` to see which code was used
   - Count conversions per affiliate code

2. **In Code** (Future Enhancement):
   - Add analytics tracking in `captureAffiliateCode()`
   - Send events to Google Analytics or Mixpanel
   - Track conversion rates per affiliate

---

## 🚨 Important Notes

1. **Same Email Workflow**: Affiliate users receive the SAME email workflow as paid users because they get the same `students-paid` or `professionals-paid` tags.

2. **No Payment Required**: Affiliate users completely bypass Xendit payment checkout.

3. **Session-Based**: Affiliate code is stored in sessionStorage, so it persists during the user's session but clears when they close the browser.

4. **Case-Insensitive**: Affiliate codes are converted to lowercase, so `ZEROTOAIHERO` and `zerotoaihero` are treated the same.

5. **Single Code**: Currently only `zerotoaihero` is valid. Add more codes in `affiliateTracking.js` as needed.

---

## 🔐 Security Considerations

1. **Validation**: Only codes in `VALID_AFFILIATE_CODES` array are accepted
2. **Server-Side**: Affiliate status is validated on the server (api/lead.js)
3. **No Bypass**: Users can't manually add `?affiliate=true` to success URL - it's only set by the system after validating the affiliate code

---

## 🎯 Benefits

1. ✅ **Simple Implementation**: No complex affiliate tracking system needed
2. ✅ **Same Workflow**: Affiliate users get same experience as paid users (emails, access, etc.)
3. ✅ **Easy Tracking**: Can identify and count affiliate users in GHL
4. ✅ **Flexible**: Easy to add more affiliate codes as needed
5. ✅ **No Payment Friction**: Affiliate users skip payment entirely

---

## 📝 Future Enhancements (Optional)

1. **Coupon Codes**: Add a coupon code input field in LeadModal
2. **Expiration Dates**: Add expiration dates to affiliate codes
3. **Usage Limits**: Limit number of uses per affiliate code
4. **Analytics Dashboard**: Build dashboard to track affiliate performance
5. **Commission Tracking**: Track revenue per affiliate (if needed)
6. **Dynamic Codes**: Generate unique codes per affiliate partner
7. **Discount Codes**: Instead of free access, offer percentage discounts

---

**Date**: November 6, 2025  
**Status**: ✅ Complete  
**Impact**: High - Enables free affiliate registrations while maintaining same workflow

