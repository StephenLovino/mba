# Testing Checklist - Xendit Payment Workaround

## Pre-Testing Setup

### Environment Variables
- [ ] `.env.local` file exists with all required variables
- [ ] `GHL_LOCATION_ID` is set
- [ ] `GHL_TOKEN` is set
- [ ] `XENDIT_STUDENT_STAGING_LINK` is set
- [ ] `XENDIT_PROFESSIONAL_STAGING_LINK` is set
- [ ] `XENDIT_STUDENT_LINK` is set (production)
- [ ] `XENDIT_PROFESSIONAL_LINK` is set (production)
- [ ] `PRICE_STUDENT=500` is set
- [ ] `PRICE_PROFESSIONAL=1000` is set

### Vercel Deployment
- [ ] All environment variables added to Vercel
- [ ] Latest code deployed to Vercel
- [ ] Preview URL accessible
- [ ] Production URL accessible

---

## Local Testing (localhost:3000)

### Test 1: Lead Form - Student
- [ ] Open homepage
- [ ] Click any CTA button
- [ ] Lead modal opens
- [ ] Fill in:
  - Name: "Test Student"
  - Email: "teststudent@example.com"
  - Role: Select "Student"
  - Organization: "Test University"
  - Year: "3rd Year"
- [ ] Click Continue
- [ ] Click Submit
- [ ] Redirects to `/checkout` with correct URL params
- [ ] Check GHL: Contact created with tags: `MBA Lead`, `student`, `org:test-university`, `year:3rd-year`

### Test 2: Checkout Page - Student
- [ ] Checkout page loads successfully
- [ ] Shows correct email: "teststudent@example.com"
- [ ] Shows correct type: "Student (₱500)"
- [ ] Xendit iframe loads with staging student link
- [ ] Iframe shows Xendit payment form
- [ ] Warning notice is visible
- [ ] "I've Completed Payment" button is visible
- [ ] "Back to Registration" button is visible

### Test 3: Payment Completion - Student
- [ ] Complete payment in Xendit iframe (use test card if available)
- [ ] Click "I've Completed Payment - Get My E-Ticket" button
- [ ] Button shows loading state: "⏳ Confirming Payment..."
- [ ] Redirects to `/eticket` page
- [ ] E-ticket page shows success message
- [ ] Check GHL: Contact updated with tag `students-paid`
- [ ] Check GHL: Workflow triggered (if configured)
- [ ] Check email: Webinar details email received (if workflow configured)

### Test 4: Lead Form - Professional
- [ ] Open homepage
- [ ] Click any CTA button
- [ ] Lead modal opens
- [ ] Fill in:
  - Name: "Test Professional"
  - Email: "testpro@example.com"
  - Role: Select "Professional"
  - Organization: "Test Company"
  - Year: (leave empty)
- [ ] Click Continue
- [ ] Click Submit
- [ ] Redirects to `/checkout` with correct URL params
- [ ] Check GHL: Contact created with tags: `MBA Lead`, `professional`, `org:test-company`

### Test 5: Checkout Page - Professional
- [ ] Checkout page loads successfully
- [ ] Shows correct email: "testpro@example.com"
- [ ] Shows correct type: "Professional (₱1000)"
- [ ] Xendit iframe loads with staging professional link
- [ ] Iframe shows Xendit payment form
- [ ] Warning notice is visible
- [ ] "I've Completed Payment" button is visible

### Test 6: Payment Completion - Professional
- [ ] Complete payment in Xendit iframe
- [ ] Click "I've Completed Payment - Get My E-Ticket" button
- [ ] Button shows loading state
- [ ] Redirects to `/eticket` page
- [ ] E-ticket page shows success message
- [ ] Check GHL: Contact updated with tag `professionals-paid`
- [ ] Check GHL: Workflow triggered (if configured)
- [ ] Check email: Webinar details email received (if workflow configured)

### Test 7: Error Handling - Missing Params
- [ ] Navigate directly to `/checkout` (no URL params)
- [ ] Should show error: "Missing required information. Please start over."
- [ ] "Back to Registration" button visible
- [ ] Click button, redirects to homepage

### Test 8: Error Handling - Invalid Email
- [ ] Navigate to `/checkout?email=invalid&role=student`
- [ ] Checkout page loads (validation is lenient)
- [ ] Complete payment flow
- [ ] Should handle gracefully or show error

### Test 9: Back Button
- [ ] On checkout page, click "Back to Registration"
- [ ] Should redirect to homepage
- [ ] Lead modal should not be open

### Test 10: Multiple Submissions
- [ ] Submit lead form with same email twice
- [ ] Should update existing contact (upsert)
- [ ] Check GHL: Only one contact exists
- [ ] Tags should be updated/merged

---

## Staging/Preview Testing (Vercel Preview URL)

### Test 11: Staging Environment Detection
- [ ] Deploy to Vercel preview
- [ ] Open preview URL
- [ ] Complete lead form as student
- [ ] On checkout page, verify staging link is used
- [ ] Check browser console: Should log staging link
- [ ] Verify iframe src contains `checkout-staging.xendit.co`

### Test 12: End-to-End Flow - Staging
- [ ] Complete full flow from lead form to e-ticket
- [ ] Verify all steps work on staging
- [ ] Verify GHL contact created and updated
- [ ] Verify emails sent (if workflows configured)

---

## Production Testing (Production URL)

### Test 13: Production Environment Detection
- [ ] Open production URL
- [ ] Complete lead form as student
- [ ] On checkout page, verify production link is used
- [ ] Check browser console: Should log production link
- [ ] Verify iframe src contains `checkout.xendit.co` (not staging)

### Test 14: Real Payment - Student
- [ ] Complete lead form with real email
- [ ] Complete real payment in Xendit (₱500)
- [ ] Click "I've Completed Payment"
- [ ] Verify e-ticket page shows
- [ ] Check GHL: Contact has `students-paid` tag
- [ ] Check email: Webinar details received

### Test 15: Real Payment - Professional
- [ ] Complete lead form with real email
- [ ] Complete real payment in Xendit (₱1000)
- [ ] Click "I've Completed Payment"
- [ ] Verify e-ticket page shows
- [ ] Check GHL: Contact has `professionals-paid` tag
- [ ] Check email: Webinar details received

---

## Mobile Testing

### Test 16: Mobile - Lead Form
- [ ] Open on mobile device (or Chrome DevTools mobile view)
- [ ] Lead modal displays correctly
- [ ] Form fields are usable
- [ ] Buttons are tappable
- [ ] Submit works

### Test 17: Mobile - Checkout Page
- [ ] Checkout page displays correctly on mobile
- [ ] Iframe is responsive
- [ ] Buttons are tappable
- [ ] Payment form in iframe is usable

### Test 18: Mobile - E-Ticket Page
- [ ] E-ticket page displays correctly on mobile
- [ ] Text is readable
- [ ] "Return to Home" button works

---

## Edge Cases

### Test 19: Special Characters in Name/Org
- [ ] Submit form with name: "José O'Brien-Smith"
- [ ] Submit form with org: "Company & Co. (Pvt.) Ltd."
- [ ] Verify GHL contact created
- [ ] Verify tags are sanitized correctly

### Test 20: Very Long Inputs
- [ ] Submit form with very long name (100+ chars)
- [ ] Submit form with very long organization (100+ chars)
- [ ] Verify system handles gracefully

### Test 21: Empty Optional Fields
- [ ] Submit form with only required fields (name, email, role)
- [ ] Leave organization and year empty
- [ ] Verify checkout works
- [ ] Verify GHL contact created without optional tags

### Test 22: Duplicate Email Different Role
- [ ] Submit as student with email "test@example.com"
- [ ] Submit as professional with same email
- [ ] Check GHL: Should update contact, not create duplicate
- [ ] Verify tags include both `student` and `professional`

### Test 23: Browser Back Button
- [ ] On checkout page, click browser back button
- [ ] Should go back to homepage
- [ ] Click forward, should return to checkout
- [ ] Verify state is preserved

### Test 24: Page Refresh on Checkout
- [ ] On checkout page, refresh the page
- [ ] Should reload with same URL params
- [ ] Iframe should reload
- [ ] Buttons should still work

### Test 25: API Timeout/Error
- [ ] Simulate API error (disconnect internet or use DevTools)
- [ ] Click "I've Completed Payment"
- [ ] Should show error message
- [ ] Should not redirect
- [ ] Button should re-enable

---

## GHL Verification

### Test 26: Contact Creation
- [ ] After lead form submission, check GHL
- [ ] Contact exists with correct email
- [ ] Contact has correct name
- [ ] Contact has tags: `MBA Lead`, role
- [ ] Contact has custom fields (if configured)

### Test 27: Contact Update - Payment
- [ ] After payment confirmation, check GHL
- [ ] Same contact (not duplicate)
- [ ] Has paid tag: `students-paid` or `professionals-paid`
- [ ] All previous tags still present

### Test 28: Workflow Triggers
- [ ] Check GHL Workflows
- [ ] Verify "Lead Captured" workflow triggered
- [ ] Verify "Payment Confirmed" workflow triggered
- [ ] Check workflow logs for errors

### Test 29: Email Delivery
- [ ] Check email inbox for lead confirmation (if configured)
- [ ] Check email inbox for payment confirmation
- [ ] Verify email content is correct
- [ ] Verify links in email work

---

## Performance Testing

### Test 30: Page Load Speed
- [ ] Measure homepage load time
- [ ] Measure checkout page load time
- [ ] Measure e-ticket page load time
- [ ] All should load in < 3 seconds

### Test 31: API Response Time
- [ ] Measure `/api/lead` response time
- [ ] Measure `/api/payment-success` response time
- [ ] Both should respond in < 2 seconds

### Test 32: Concurrent Users
- [ ] Simulate multiple users submitting forms simultaneously
- [ ] Verify all contacts created in GHL
- [ ] Verify no race conditions or errors

---

## Security Testing

### Test 33: XSS Prevention
- [ ] Try submitting form with `<script>alert('xss')</script>` in name
- [ ] Verify script doesn't execute
- [ ] Verify data is sanitized

### Test 34: SQL Injection (N/A - No SQL)
- [ ] Not applicable (no database)

### Test 35: API Key Exposure
- [ ] Check browser console for exposed API keys
- [ ] Check network tab for exposed tokens
- [ ] Verify all secrets are server-side only

### Test 36: CORS
- [ ] Verify API endpoints have correct CORS headers
- [ ] Verify requests from allowed origins work
- [ ] Verify requests from disallowed origins fail

---

## Regression Testing

### Test 37: Existing Features Still Work
- [ ] Homepage loads correctly
- [ ] All sections display correctly
- [ ] Navigation works
- [ ] Footer links work
- [ ] FAQ accordion works
- [ ] Testimonials carousel works

### Test 38: Other Routes Still Work
- [ ] `/` - Homepage
- [ ] `/checkout` - Checkout page
- [ ] `/eticket` - E-ticket page
- [ ] `/test-payment` - Test payment page (if exists)

---

## Final Checklist

### Before Going Live
- [ ] All tests passed
- [ ] No console errors
- [ ] No broken links
- [ ] All images load
- [ ] All fonts load
- [ ] Mobile responsive
- [ ] Cross-browser tested (Chrome, Firefox, Safari, Edge)
- [ ] GHL workflows configured and tested
- [ ] Email templates configured and tested
- [ ] Support email address is correct
- [ ] Xendit production links are correct
- [ ] Environment variables set in Vercel production
- [ ] DNS configured correctly
- [ ] SSL certificate active
- [ ] Analytics tracking (if configured)

### Post-Launch Monitoring
- [ ] Monitor Vercel logs for errors
- [ ] Monitor GHL for contact creation
- [ ] Monitor email delivery
- [ ] Monitor user feedback
- [ ] Check payment completion rate
- [ ] Check e-ticket page visits

---

## Bug Reporting Template

If you find a bug, report it with:
- **Description**: What happened?
- **Expected**: What should have happened?
- **Steps to Reproduce**: How to recreate the bug?
- **Environment**: Local/Staging/Production?
- **Browser**: Chrome/Firefox/Safari/Edge?
- **Device**: Desktop/Mobile?
- **Screenshots**: If applicable
- **Console Errors**: Copy from browser console
- **Network Errors**: Copy from browser network tab

