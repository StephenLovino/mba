# Participant Tagging Implementation

## Overview
When a student pays for themselves and adds participants, we now automatically tag those participants with `participants-paid` in GHL so you can trigger appropriate workflows.

## Changes Made

### 1. Frontend Changes

#### `src/components/LeadModal.js`
- When redirecting to checkout, we now pass participant emails as a comma-separated URL parameter
- This happens in all three redirect scenarios (success, API failure, network error)
- Example: `?participants=john@email.com,jane@email.com`

#### `src/components/CheckoutStudent.js`
- Extracts participant emails from URL parameters
- Passes participant emails to both:
  - The `create-invoice` API (for Xendit metadata)
  - The `payment-success` API (for manual confirmation)

### 2. Backend Changes

#### `api/create-invoice.js`
- Accepts `participantEmails` array in request body
- Stores participant emails in Xendit invoice metadata as JSON string
- This allows the webhook to access participant info when payment is confirmed

#### `api/payment-success.js`
- Accepts `participantEmails` array in request body
- After tagging the primary payer with `students-paid`, it loops through participants
- Tags each participant with: `['MBA Lead', 'student', 'participant', 'participants-paid']`
- Returns count of participants tagged in response

#### `api/webhooks/xendit.js`
- After successfully tagging the primary payer, checks for `participantEmails` in metadata
- Parses the JSON string and loops through participant emails
- Tags each participant with: `['MBA Lead', 'student', 'participant', 'participants-paid']`
- Handles errors gracefully to avoid webhook retry storms

## Tag Structure

### Primary Payer (Student)
- `MBA Lead`
- `student`
- `students-paid`
- `org:university-name` (if provided)
- `year:1st-year` (if provided)

### Participants
- `MBA Lead`
- `student`
- `participant` (added during registration)
- `participants-paid` (added after primary payer completes payment)

## GHL Workflow Setup

You can now create a workflow in GHL that triggers on the `participants-paid` tag:

1. **Trigger**: Contact Created or Tag Added
2. **Filter**: Has Tag equals `participants-paid`
3. **Actions**: 
   - Send welcome email to participant
   - Add to participant-specific nurture sequence
   - Send e-ticket (if needed)
   - Any other participant-specific actions

## Flow Diagram

```
Student Registration
├─ Primary Payer Info Collected
├─ Participants Added (optional)
│  └─ Participants created with tags: ['MBA Lead', 'student', 'participant']
│
└─ Checkout Process
   ├─ Participant emails passed via URL
   ├─ Participant emails stored in Xendit metadata
   │
   └─ Payment Completed
      ├─ Primary payer tagged: 'students-paid'
      └─ Participants tagged: 'participants-paid'
```

## Testing

To test this feature:

1. Register as a student
2. Add 1-2 participants with valid email addresses
3. Complete the checkout process
4. Verify in GHL that:
   - Primary payer has `students-paid` tag
   - Participants have `participants-paid` tag
5. Check that your workflow triggers for participants

## Notes

- Participant tagging happens in two places for redundancy:
  1. Manual confirmation via `payment-success` API
  2. Automatic confirmation via Xendit webhook
- If one method fails, the other should still work
- Errors in participant tagging don't block the primary payer's payment confirmation
- Invalid or empty participant emails are skipped gracefully

