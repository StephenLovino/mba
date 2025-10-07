export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { email, role } = req.body || {};
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
    
    console.log('Updating contact with payment tag:', { email, role, paymentTag });

    // Update contact with payment tag
    const updateRes = await fetch(`${apiBase}/contacts/`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        email,
        tags: ['MBA Lead', role, paymentTag],
        locationId
      })
    });

    const updateText = await updateRes.text();
    let updateJson = {};
    try { 
      updateJson = JSON.parse(updateText || '{}'); 
    } catch (parseErr) {
      console.error('Update response parse error:', parseErr);
    }

    console.log('GHL Update Response:', {
      status: updateRes.status,
      statusText: updateRes.statusText,
      body: updateText,
      parsed: updateJson
    });

    if (!updateRes.ok) {
      console.error('Failed to update contact with payment tag:', {
        status: updateRes.status,
        response: updateText,
        request: { email, role, paymentTag }
      });
      res.status(502).json({ 
        error: 'Failed to update contact', 
        details: updateJson || updateText 
      });
      return;
    }

    res.status(200).json({ 
      success: true, 
      message: 'Contact updated with payment status',
      contactId: updateJson?.contact?.id || updateJson?.id,
      tags: ['MBA Lead', role, paymentTag]
    });

  } catch (e) {
    console.error('Payment success API error:', e);
    res.status(500).json({ error: 'Internal server error', message: e?.message || String(e) });
  }
}
