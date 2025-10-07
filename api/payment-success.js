export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Better JSON parsing
    let body = {};
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      res.status(400).json({ error: 'Invalid JSON', details: parseError.message });
      return;
    }
    
    const { email, role } = body;
    if (!email || !role) {
      res.status(400).json({ error: 'Missing email or role' });
      return;
    }

    // Configure GHL API
    const apiBase = (process.env.GHL_API_BASE || 'https://services.leadconnectorhq.com').replace(/\/$/, '');
    const ghlToken = process.env.GHL_TOKEN || process.env.GHL_API_KEY;
    const locationId = process.env.GHL_LOCATION_ID;

    if (!locationId || !ghlToken) {
      res.status(500).json({ error: 'GHL configuration missing' });
      return;
    }

    const headers = { 
      'Content-Type': 'application/json', 
      'Accept': 'application/json',
      'Authorization': `Bearer ${ghlToken}`,
      'Version': '2021-07-28'
    };

    // Determine payment tag based on role
    const paymentTag = role === 'student' ? 'students-paid' : 'professionals-paid';
    
    console.log('Adding payment tag to contact:', { email, role, paymentTag });

    // Use the Upsert Contact API instead - it can handle both create and update
    console.log('Upserting contact with payment tags:', { email, role, paymentTag });
    
    const upsertRes = await fetch(`${apiBase}/contacts/`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        email: email,
        locationId: locationId,
        source: 'payment confirmation',
        tags: ['MBA Lead', role, paymentTag]
      })
    });

    const upsertText = await upsertRes.text();
    let upsertJson = {};
    try { 
      upsertJson = JSON.parse(upsertText || '{}'); 
    } catch (parseErr) {
      console.error('Upsert response parse error:', parseErr);
    }

    console.log('GHL Upsert Response:', {
      status: upsertRes.status,
      statusText: upsertRes.statusText,
      body: upsertText,
      parsed: upsertJson
    });

    if (!upsertRes.ok) {
      console.error('Failed to upsert contact with payment tags:', {
        status: upsertRes.status,
        response: upsertText,
        request: { email, role, paymentTag }
      });
      res.status(502).json({ 
        error: 'Failed to upsert contact', 
        details: upsertJson || upsertText 
      });
      return;
    }

    const contactId = upsertJson?.contact?.id || upsertJson?.id;
    
    res.status(200).json({ 
      success: true, 
      message: 'Payment confirmed and contact updated with payment tags',
      contactId: contactId,
      email: email,
      role: role,
      paymentTag: paymentTag
    });

  } catch (e) {
    console.error('Payment success API error:', e);
    res.status(500).json({ error: 'Internal server error', message: e?.message || String(e) });
  }
}
