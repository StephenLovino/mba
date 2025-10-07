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

    // First, find the contact by email
    const searchRes = await fetch(`${apiBase}/contacts/?email=${encodeURIComponent(email)}&locationId=${locationId}`, {
      method: 'GET',
      headers
    });

    if (!searchRes.ok) {
      console.error('Failed to search for contact:', searchRes.status, await searchRes.text());
      res.status(502).json({ 
        error: 'Failed to find contact', 
        details: 'Could not locate contact by email' 
      });
      return;
    }

    const searchData = await searchRes.json();
    const contacts = searchData.contacts || [];
    
    if (contacts.length === 0) {
      console.log('No contact found with email:', email);
      res.status(404).json({ 
        error: 'Contact not found', 
        details: 'No contact found with this email address' 
      });
      return;
    }

    const contact = contacts[0];
    const contactId = contact.id;
    
    console.log('Found contact:', { contactId, email: contact.email, currentTags: contact.tags });

    // Add payment tag to existing contact
    const addTagRes = await fetch(`${apiBase}/contacts/${contactId}/tags`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        tags: [paymentTag]
      })
    });

    const addTagText = await addTagRes.text();
    let addTagJson = {};
    try { 
      addTagJson = JSON.parse(addTagText || '{}'); 
    } catch (parseErr) {
      console.error('Add tag response parse error:', parseErr);
    }

    console.log('GHL Add Tag Response:', {
      status: addTagRes.status,
      statusText: addTagRes.statusText,
      body: addTagText,
      parsed: addTagJson
    });

    if (!addTagRes.ok) {
      console.error('Failed to add payment tag to contact:', {
        status: addTagRes.status,
        response: addTagText,
        request: { contactId, email, role, paymentTag }
      });
      res.status(502).json({ 
        error: 'Failed to add payment tag', 
        details: addTagJson || addTagText 
      });
      return;
    }

    res.status(200).json({ 
      success: true, 
      message: 'Payment tag added successfully',
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
