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
    
    const { email, role, organization, yearInCollege, participantEmails } = body;
    if (!email || !role) {
      res.status(400).json({ error: 'Missing email or role' });
      return;
    }

    console.log('Payment success request:', { email, role, organization, yearInCollege, participantEmails });

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
    console.log('Upserting contact with payment tags:', { email, role, paymentTag, organization, yearInCollege });
    
    // Build tags array with new fields
    const tags = ['MBA Lead', role, paymentTag];
    if (organization) {
      tags.push(`org:${organization.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase()}`);
    }
    if (yearInCollege) {
      tags.push(`year:${yearInCollege.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase()}`);
    }
    
    const upsertRes = await fetch(`${apiBase}/contacts/`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        email: email,
        locationId: locationId,
        source: 'payment confirmation',
        tags: tags
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

    // If this is a student payment and there are participants, tag them with 'participants-paid'
    if (role === 'student' && Array.isArray(participantEmails) && participantEmails.length > 0) {
      console.log('Tagging participants with participants-paid:', participantEmails);

      for (const participantEmail of participantEmails) {
        if (!participantEmail || !participantEmail.trim()) continue;

        try {
          const trimmedEmail = participantEmail.trim();

          // Step 1: Search for existing contact by email
          const searchUrl = `${apiBase}/contacts/search/duplicate?locationId=${locationId}&email=${encodeURIComponent(trimmedEmail)}`;
          const searchRes = await fetch(searchUrl, {
            method: 'GET',
            headers
          });

          let contactIdToTag = null;

          if (searchRes.ok) {
            const searchData = await searchRes.json();
            const existingContact = searchData?.contact;

            if (existingContact) {
              contactIdToTag = existingContact.id;
              console.log(`Found existing participant ${trimmedEmail} with ID: ${contactIdToTag}`);
            }
          }

          // Step 2: Add 'participants-paid' tag using the Add Tags endpoint
          if (contactIdToTag) {
            const addTagsUrl = `${apiBase}/contacts/${contactIdToTag}/tags`;
            const addTagsRes = await fetch(addTagsUrl, {
              method: 'POST',
              headers,
              body: JSON.stringify({
                tags: ['participants-paid']
              })
            });

            if (addTagsRes.ok) {
              console.log(`Successfully added participants-paid tag to ${trimmedEmail}`);
            } else {
              const errorText = await addTagsRes.text();
              console.error(`Failed to add tag to participant ${trimmedEmail}:`, errorText);
            }
          } else {
            console.warn(`Participant ${trimmedEmail} not found in GHL, skipping tag addition`);
          }
        } catch (participantError) {
          console.error(`Error tagging participant ${participantEmail}:`, participantError);
          // Continue with other participants even if one fails
        }
      }
    }

    res.status(200).json({
      success: true,
      message: 'Payment confirmed and contact updated with payment tags',
      contactId: contactId,
      email: email,
      role: role,
      paymentTag: paymentTag,
      participantsTagged: participantEmails?.length || 0
    });

  } catch (e) {
    console.error('Payment success API error:', e);
    res.status(500).json({ error: 'Internal server error', message: e?.message || String(e) });
  }
}
