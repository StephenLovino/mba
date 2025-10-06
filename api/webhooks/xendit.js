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

    if (!expected || signature !== expected) {
      res.status(401).send('Invalid signature');
      return;
    }

    const event = JSON.parse(raw || '{}');
    // Minimal example: on paid invoice, update GHL contact tag/status
    const status = event?.status || event?.data?.status;
    const email = event?.payer_email || event?.data?.payer_email || event?.data?.payer?.email;

    if (status === 'PAID' && email) {
      const apiUrl = process.env.PRIVATE_GHL_PROXY_URL || process.env.GHL_API_BASE;
      if (apiUrl) {
        const headers = { 'Content-Type': 'application/json' };
        if (process.env.GHL_API_KEY) headers['Authorization'] = `Bearer ${process.env.GHL_API_KEY}`;
        await fetch(`${apiUrl.replace(/\/$/, '')}/contacts/update`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ email, tag: 'Paid', status: 'Paid', locationId: process.env.GHL_LOCATION_ID || undefined })
        }).catch(() => {});
      }
    }

    res.status(200).send('ok');
  } catch (e) {
    console.error(e);
    res.status(200).send('ok'); // respond 200 to avoid retries storms; monitor logs
  }
}


