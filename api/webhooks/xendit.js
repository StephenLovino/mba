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

        // Search for existing contact first (avoid duplicates)
        const searchUrl = `${apiBase}/contacts/search/duplicate?locationId=${locationId}&email=${encodeURIComponent(email)}`;
        console.log('Searching for existing contact:', email);

        const searchRes = await fetch(searchUrl, {
          method: 'GET',
          headers
        });

        let contactId = null;

        if (searchRes.ok) {
          const searchData = await searchRes.json();
          const existingContact = searchData?.contact;

          if (existingContact) {
            contactId = existingContact.id;
            console.log('Found existing contact:', { id: contactId, email, currentTags: existingContact.tags });
          } else {
            console.warn('Contact not found for webhook payment:', email);
          }
        } else {
          console.error('Failed to search for contact:', await searchRes.text());
        }

        // If contact found, add payment tags
        if (contactId) {
          const tagsToAdd = [paymentTag];
          if (metadata.organization) {
            tagsToAdd.push(`org:${metadata.organization.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase()}`);
          }
          if (metadata.yearInCollege) {
            tagsToAdd.push(`year:${metadata.yearInCollege.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '-').toLowerCase()}`);
          }

          const addTagsUrl = `${apiBase}/contacts/${contactId}/tags`;
          const addTagsRes = await fetch(addTagsUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              tags: tagsToAdd
            })
          });

          if (addTagsRes.ok) {
            const addTagsData = await addTagsRes.json();
            console.log('Successfully added payment tags via webhook:', addTagsData);
          } else {
            console.error('Failed to add payment tags via webhook:', await addTagsRes.text());
          }
        } else {
          console.error('Cannot add payment tags - contact not found');
        }

        // If this is a student payment and there are participants in metadata, tag them
        if (contactId && role === 'student' && metadata.participantEmails) {
            try {
              const participantEmails = JSON.parse(metadata.participantEmails);
              console.log('Tagging participants from webhook:', participantEmails);

              if (Array.isArray(participantEmails) && participantEmails.length > 0) {
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
                  }
                }
              }
            } catch (parseError) {
              console.error('Error parsing participant emails from metadata:', parseError);
            }
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


