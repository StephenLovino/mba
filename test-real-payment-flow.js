// Test script to simulate a real payment flow with participants
// This tests the EXACT flow that should happen when a student completes payment
// Run with: node test-real-payment-flow.js

require('dotenv').config({ path: '.env.local' });

// Use your production URL or localhost
const API_BASE = process.env.PRODUCTION_URL || 'http://localhost:3000';

// Test with REAL emails from your GHL screenshot
const PRIMARY_EMAIL = 'stephen.ben19@gmail.com'; // The student who pays
const PARTICIPANT_EMAILS = [
  'stephenjj.lovino@gmail.com',  // Participant 1
  'yurakusu@gmail.com',          // Participant 2
  'rakusu17@gmail.com'           // Participant 3
];

async function testPaymentFlow() {
  console.log('=== Testing Real Payment Flow ===\n');
  console.log('API Base:', API_BASE);
  console.log('Primary Email:', PRIMARY_EMAIL);
  console.log('Participant Emails:', PARTICIPANT_EMAILS);
  console.log('\n');

  try {
    // Simulate what CheckoutStudent.js sends when user clicks "I've Completed Payment"
    const payload = {
      email: PRIMARY_EMAIL,
      role: 'student',
      organization: 'Test University',
      yearInCollege: '1st Year College',
      participantEmails: PARTICIPANT_EMAILS // This is the key part!
    };

    console.log('Sending payment confirmation...');
    console.log('Payload:', JSON.stringify(payload, null, 2));
    console.log('\n');

    const response = await fetch(`${API_BASE}/api/payment-success`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    console.log('Response Status:', response.status, response.statusText);
    console.log('\n');

    const data = await response.json();
    console.log('Response Data:', JSON.stringify(data, null, 2));
    console.log('\n');

    if (response.ok) {
      console.log('✅ Payment success endpoint worked!');
      console.log(`Participants tagged: ${data.participantsTagged || 0}`);
      console.log('\n');
      console.log('Now check GHL to verify:');
      console.log(`1. Primary (${PRIMARY_EMAIL}) has: students-paid tag`);
      console.log(`2. Each participant has: participants-paid tag`);
      console.log('\n');
      console.log('Expected tags on participants:');
      PARTICIPANT_EMAILS.forEach(email => {
        console.log(`   - ${email}: ['MBA Lead', 'student', 'participant', 'participants-paid']`);
      });
    } else {
      console.log('❌ Payment success endpoint failed');
      console.log('Error:', data);
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run the test
testPaymentFlow();

