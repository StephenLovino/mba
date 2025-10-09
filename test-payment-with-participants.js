// Test script to simulate a payment with participants
// Run with: node test-payment-with-participants.js

require('dotenv').config({ path: '.env.local' });

const PAYMENT_SUCCESS_URL = 'http://localhost:3000/api/payment-success';

// Test data - use real emails from your GHL
const testPayload = {
  email: 'stephen.ben19@gmail.com', // Primary payer
  role: 'student',
  organization: 'Test University',
  yearInCollege: '1st Year College',
  participantEmails: [
    'stephen.ben19@gmail.com', // This should get the participants-paid tag
    'stephenjj.lovino@gmail.com' // Add another if you have one
  ]
};

async function testPaymentSuccess() {
  console.log('=== Testing Payment Success with Participants ===\n');
  console.log('Payload:', JSON.stringify(testPayload, null, 2));
  console.log('\n');

  try {
    const response = await fetch(PAYMENT_SUCCESS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testPayload)
    });

    console.log('Response Status:', response.status, response.statusText);
    
    const data = await response.json();
    console.log('Response Data:', JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('\n✅ Payment success endpoint worked!');
      console.log(`Participants tagged: ${data.participantsTagged}`);
      console.log('\nNow check GHL to see if the participants have the "participants-paid" tag');
    } else {
      console.log('\n❌ Payment success endpoint failed');
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run the test
testPaymentSuccess();

