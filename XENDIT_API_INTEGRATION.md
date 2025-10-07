# Xendit API Integration Guide

## Overview

This application now uses **Xendit Invoice API** for payment processing, which provides:
- ✅ Dynamic invoice creation with pre-filled customer data
- ✅ Automatic payment verification via webhooks
- ✅ Better tracking - each invoice is unique per user
- ✅ No manual confirmation needed
- ✅ Automatic redirect after successful payment

---

## Setup Instructions

### 1. Environment Variables

Add these to your `.env.local` file:

```env
# Xendit API Keys (Production)
XENDIT_SECRET_KEY=xnd_production_roNnnsml8yxPIJKyHmNtQ75i5QZmxSomwvbk1VEsQk3CfDhxQ5yA48LumquYDU
XENDIT_PUBLIC_KEY=xnd_public_production_jQMkqwNfMQyZmtMUNMmWORzCAFr_JmDQrTitOqTLtYKclCIUsFp6rFPbvEp0vIK

# Xendit Webhook Verification Token
XENDIT_WEBHOOK_TOKEN=your-webhook-verification-token-from-xendit

# GHL Integration
GHL_LOCATION_ID=bbfZjbxapaQ2U2ocMVlA
GHL_TOKEN=pit-1cbdceab-07fc-4c0d-a5b7-b55ab87b5074

# Pricing
PRICE_STUDENT=500
PRICE_PROFESSIONAL=1000
```

### 2. Configure Xendit Webhook

1. **Log in to Xendit Dashboard**: https://dashboard.xendit.co/
2. **Go to Settings → Webhooks**
3. **Add a new webhook** with these settings:
   - **URL**: `https://your-domain.vercel.app/api/webhooks/xendit`
   - **Events to listen**: 
     - ✅ `invoice.paid`
     - ✅ `invoice.expired`
   - **Verification Token**: Generate a secure token and add it to your `.env.local` as `XENDIT_WEBHOOK_TOKEN`

4. **Test the webhook** using Xendit's test mode

---

## How It Works

### Payment Flow

```
1. User fills registration form
   ↓
2. Form submits to /api/lead
   ↓
3. Creates GHL contact with tags
   ↓
4. Redirects to /checkout-student or /checkout-professional
   ↓
5. Checkout page calls /api/create-invoice
   ↓
6. Creates unique Xendit invoice with pre-filled data
   ↓
7. Displays Xendit payment form in iframe
   ↓
8. User completes payment
   ↓
9. Xendit sends webhook to /api/webhooks/xendit
   ↓
10. Webhook updates GHL contact with payment tag
   ↓
11. User is automatically redirected to /eticket
   ↓
12. GHL workflow sends confirmation email
```

### API Endpoints

#### `/api/create-invoice` (POST)
Creates a unique Xendit invoice for a user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "role": "student",
  "organization": "University of Example",
  "yearInCollege": "3rd Year"
}
```

**Response:**
```json
{
  "success": true,
  "invoice_id": "64f7c8a9b2e1234567890abc",
  "invoice_url": "https://checkout.xendit.co/web/64f7c8a9b2e1234567890abc",
  "external_id": "MBA-student-1234567890-userexamplecom",
  "amount": 500,
  "status": "PENDING"
}
```

#### `/api/webhooks/xendit` (POST)
Receives payment notifications from Xendit.

**Webhook Payload (Invoice Paid):**
```json
{
  "id": "64f7c8a9b2e1234567890abc",
  "external_id": "MBA-student-1234567890-userexamplecom",
  "status": "PAID",
  "payer_email": "user@example.com",
  "amount": 500,
  "paid_at": "2025-01-15T10:30:00.000Z",
  "metadata": {
    "email": "user@example.com",
    "role": "student",
    "organization": "University of Example",
    "yearInCollege": "3rd Year",
    "name": "John Doe"
  }
}
```

**Actions:**
1. Verifies webhook signature using `XENDIT_WEBHOOK_TOKEN`
2. Extracts user data from metadata
3. Updates GHL contact with payment tag (`students-paid` or `professionals-paid`)
4. Returns 200 OK

---

## Invoice Configuration

### Invoice Details

- **Currency**: PHP (Philippine Peso)
- **Duration**: 24 hours (86400 seconds)
- **Student Price**: ₱500
- **Professional Price**: ₱1000

### Success/Failure Redirects

**Success Redirect:**
```
https://your-domain.com/eticket?email={email}&role={role}&org={org}&year={year}&name={name}
```

**Failure Redirect:**
```
https://your-domain.com/checkout-{role}?email={email}&org={org}&year={year}&name={name}&error=payment_failed
```

### Metadata Stored

Each invoice includes metadata for tracking:
- `email`: User's email address
- `role`: "student" or "professional"
- `organization`: User's organization
- `yearInCollege`: Student's year (if applicable)
- `name`: User's full name
- `source`: "MBA Registration Form"

---

## Testing

### Test Mode

To test the integration:

1. **Use Xendit Test Keys** (get from Xendit Dashboard):
   ```env
   XENDIT_SECRET_KEY=xnd_development_...
   XENDIT_PUBLIC_KEY=xnd_public_development_...
   ```

2. **Test Payment Methods**:
   - Use Xendit's test card numbers
   - Test e-wallets in sandbox mode

3. **Verify Webhook**:
   - Check Vercel logs for webhook events
   - Verify GHL contact is updated with payment tag

### Manual Testing Checklist

- [ ] Student registration creates invoice with ₱500
- [ ] Professional registration creates invoice with ₱1000
- [ ] Invoice displays correct user information
- [ ] Payment completion triggers webhook
- [ ] GHL contact receives correct payment tag
- [ ] User is redirected to e-ticket page
- [ ] Confirmation email is sent

---

## Troubleshooting

### Invoice Creation Fails

**Error**: "Payment system not configured"
- **Solution**: Verify `XENDIT_SECRET_KEY` is set in `.env.local`

**Error**: "Failed to create invoice"
- **Solution**: Check Xendit API logs in dashboard
- Verify API key has correct permissions

### Webhook Not Received

**Error**: Payment completes but GHL not updated
- **Solution**: 
  1. Check webhook URL is correct in Xendit dashboard
  2. Verify `XENDIT_WEBHOOK_TOKEN` matches
  3. Check Vercel function logs for errors

### Payment Tag Not Added

**Error**: Webhook received but tag not added
- **Solution**:
  1. Verify `GHL_TOKEN` and `GHL_LOCATION_ID` are correct
  2. Check GHL API permissions
  3. Review webhook logs for GHL API errors

---

## Migration from Static Links

### Old Approach (Deprecated)
- Used static Xendit invoice links
- Required manual "I've completed payment" button
- No pre-filled customer data
- Difficult to track individual payments

### New Approach (Current)
- Creates unique invoice per user
- Automatic payment verification
- Pre-filled customer information
- Better tracking and reporting

### Backward Compatibility

The old static links are still configured as fallback:
```env
XENDIT_STUDENT_LINK=https://checkout.xendit.co/od/aistudent
XENDIT_PROFESSIONAL_LINK=https://checkout.xendit.co/od/aiprofessional
```

To revert to static links, modify `CheckoutStudent.js` and `CheckoutProfessional.js` to use `getPaymentLink()` instead of `invoiceUrl`.

---

## Security Considerations

### API Key Security

- ✅ **Secret key** is stored in environment variables (never in frontend)
- ✅ **Public key** can be used in frontend (if needed for direct API calls)
- ✅ All API calls are made from serverless functions (backend)

### Webhook Verification

- ✅ Webhook signature is verified using `XENDIT_WEBHOOK_TOKEN`
- ✅ Invalid signatures are rejected with 401 Unauthorized
- ✅ Webhook responds with 200 OK to prevent retry storms

### Data Privacy

- ✅ User data is encrypted in transit (HTTPS)
- ✅ Sensitive data is not logged
- ✅ Metadata is used for tracking only

---

## Support

### Xendit Support
- Dashboard: https://dashboard.xendit.co/
- Documentation: https://developers.xendit.co/
- Support: support@xendit.co

### GHL Support
- Dashboard: https://app.gohighlevel.com/
- Documentation: https://highlevel.stoplight.io/
- Support: support@gohighlevel.com

---

## Next Steps

1. ✅ Add Xendit API keys to `.env.local`
2. ✅ Configure webhook in Xendit dashboard
3. ✅ Test payment flow in development
4. ✅ Deploy to production
5. ✅ Test with real payment
6. ✅ Monitor webhook logs
7. ✅ Verify GHL integration works

---

**Last Updated**: January 2025
**Version**: 2.0 (API Integration)

