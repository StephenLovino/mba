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

    // Step 1: Search for existing contact by email (avoid creating duplicates)
    const searchUrl = `${apiBase}/contacts/search/duplicate?locationId=${locationId}&email=${encodeURIComponent(email)}`;
    console.log('Searching for existing contact:', email);

    const searchRes = await fetch(searchUrl, {
      method: 'GET',
      headers
    });

    let contactId = null;

    if (!searchRes.ok) {
      const errorText = await searchRes.text();
      console.error('Failed to search for contact:', errorText);
      res.status(502).json({
        error: 'Failed to search for contact',
        details: errorText
      });
      return;
    }

    const searchData = await searchRes.json();
    const existingContact = searchData?.contact;

    if (!existingContact) {
      console.error('Contact not found:', email);
      res.status(404).json({
        error: 'Contact not found. Please register first.'
      });
      return;
    }

    contactId = existingContact.id;
    console.log('Found existing contact:', { id: contactId, email, currentTags: existingContact.tags });

    // Step 2: Build tags to add
    const tagsToAdd = [paymentTag];
    if (organization) {
      tagsToAdd.push(`org:${organization.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase()}`);
    }
    if (yearInCollege) {
      tagsToAdd.push(`year:${yearInCollege.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase()}`);
    }

    console.log('Adding tags to contact:', tagsToAdd);

    // Step 3: Add tags to existing contact (no upsert, no duplicates)
    const addTagsUrl = `${apiBase}/contacts/${contactId}/tags`;
    const addTagsRes = await fetch(addTagsUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        tags: tagsToAdd
      })
    });

    if (!addTagsRes.ok) {
      const errorText = await addTagsRes.text();
      console.error('Failed to add tags to contact:', errorText);
      res.status(502).json({
        error: 'Failed to add payment tags',
        details: errorText
      });
      return;
    }

    const addTagsData = await addTagsRes.json();
    console.log('Successfully added tags:', addTagsData);

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

          console.log(`Search response status for ${trimmedEmail}:`, searchRes.status);

          if (searchRes.ok) {
            const searchData = await searchRes.json();
            console.log(`Search data for ${trimmedEmail}:`, JSON.stringify(searchData));
            const existingContact = searchData?.contact;

            if (existingContact) {
              contactIdToTag = existingContact.id;
              console.log(`Found existing participant ${trimmedEmail} with ID: ${contactIdToTag}, current tags:`, existingContact.tags);
            } else {
              console.warn(`No contact found in search response for ${trimmedEmail}`);
            }
          } else {
            const errorText = await searchRes.text();
            console.error(`Search failed for ${trimmedEmail}:`, errorText);
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
