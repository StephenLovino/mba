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

    // Extract payment information from invoice webhook
    const status = event?.status || event?.data?.status;
    const email = event?.payer_email || event?.data?.payer_email || event?.data?.payer?.email;
    const amount = event?.amount || event?.data?.amount;
    const description = event?.description || event?.data?.description || '';
    const metadata = event?.metadata || event?.data?.metadata || {};

    console.log('Extracted payment data:', { status, email, amount, description, metadata });

    if (status === 'PAID' && email) {
      // First try to get role from metadata (most reliable)
      let role = metadata.role || 'professional';
      let paymentTag = role === 'student' ? 'students-paid' : 'professionals-paid';

      // Fallback: determine role based on amount
      if (!metadata.role) {
        if (amount && amount <= 500) {
          role = 'student';
          paymentTag = 'students-paid';
        }

        // Also check description for role indicators
        if (description.toLowerCase().includes('student')) {
          role = 'student';
          paymentTag = 'students-paid';
        }
      }

      console.log('Updating GHL contact:', { email, role, paymentTag, metadata });

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
          source: 'xendit webhook',
          // Add metadata if available
          ...(metadata.organization && { customField: { organization: metadata.organization } }),
          ...(metadata.yearInCollege && { customField: { yearInCollege: metadata.yearInCollege } })
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


