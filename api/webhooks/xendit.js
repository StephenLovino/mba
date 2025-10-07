export const config = { api: { bodyParser: false } };

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.setEncoding('utf8');
    req.on('data', (chunk) => { data += chunk; });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).send('Method not allowed');
    return;
  }

  try {
    const signature = req.headers['x-callback-token'] || '';
    const expected = process.env.XENDIT_WEBHOOK_TOKEN || '';
    const raw = await readRawBody(req);

    console.log('Xendit webhook received:', {
      hasSignature: !!signature,
      hasExpected: !!expected,
      signatureMatch: signature === expected,
      bodyLength: raw?.length || 0
    });

    if (!expected || signature !== expected) {
      console.log('Invalid webhook signature');
      res.status(401).send('Invalid signature');
      return;
    }

    const event = JSON.parse(raw || '{}');
    console.log('Xendit webhook event:', JSON.stringify(event, null, 2));

    // Extract payment information
    const status = event?.status || event?.data?.status;
    const email = event?.payer_email || event?.data?.payer_email || event?.data?.payer?.email;
    const amount = event?.amount || event?.data?.amount;
    const description = event?.description || event?.data?.description || '';

    console.log('Extracted payment data:', { status, email, amount, description });

    if (status === 'PAID' && email) {
      // Determine role based on amount or description
      let role = 'professional';
      let paymentTag = 'professionals-paid';
      
      // Check if it's a student payment (you can adjust these conditions)
      if (amount && amount < 1000) { // Assuming student price is less than 1000
        role = 'student';
        paymentTag = 'students-paid';
      }
      
      // Also check description for role indicators
      if (description.toLowerCase().includes('student')) {
        role = 'student';
        paymentTag = 'students-paid';
      }

      console.log('Updating GHL contact:', { email, role, paymentTag });

      // Update GHL contact with payment status
      const ghlToken = process.env.GHL_TOKEN;
      const locationId = process.env.GHL_LOCATION_ID;
      const apiBase = 'https://services.leadconnectorhq.com';

      if (ghlToken && locationId) {
        const headers = {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Version': '2021-07-28',
          'Authorization': `Bearer ${ghlToken}`,
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        };

        // Use Upsert Contact API to add payment tag
        const contactBody = {
          email,
          locationId,
          tags: ['MBA Lead', role, paymentTag],
          source: 'xendit webhook'
        };

        const contactRes = await fetch(`${apiBase}/contacts/`, {
          method: 'POST',
          headers,
          body: JSON.stringify(contactBody)
        });

        const contactData = await contactRes.json();
        console.log('GHL contact update result:', {
          status: contactRes.status,
          data: contactData
        });

        if (contactRes.ok) {
          console.log('Successfully updated GHL contact with payment status');
        } else {
          console.error('Failed to update GHL contact:', contactData);
        }
      } else {
        console.error('Missing GHL credentials for webhook');
      }
    }

    res.status(200).send('ok');
  } catch (e) {
    console.error('Xendit webhook error:', e);
    res.status(200).send('ok'); // respond 200 to avoid retries storms; monitor logs
  }
}


