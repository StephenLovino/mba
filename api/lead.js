export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  try {
    const { name, email, role, utms } = req.body || {};
    if (!name || !email || !role) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    // Configure GHL API: prefer direct Private Integration (token + Version header)
    const apiBase = (process.env.GHL_API_BASE || 'https://services.leadconnectorhq.com').replace(/\/$/, '');
    const ghlToken = process.env.GHL_TOKEN || process.env.GHL_API_KEY; // support either name
    const locationId = process.env.GHL_LOCATION_ID;
    if (!locationId) {
      res.status(500).json({ error: 'Missing GHL_LOCATION_ID' });
      return;
    }
    if (!ghlToken && !process.env.PRIVATE_GHL_PROXY_URL) {
      res.status(500).json({ error: 'Missing GHL token (GHL_TOKEN) or PRIVATE_GHL_PROXY_URL' });
      return;
    }

    const headers = { 'Content-Type': 'application/json' };
    if (ghlToken) {
      headers['Authorization'] = `Bearer ${ghlToken}`;
      headers['Version'] = '2021-07-28';
    }

    // 1) Create or upsert contact
    const contactBody = { name, email, locationId, source: 'public api', tags: ['MBA Lead', role] };
    const contactUrl = process.env.PRIVATE_GHL_PROXY_URL
      ? `${process.env.PRIVATE_GHL_PROXY_URL.replace(/\/$/, '')}/contacts/upsert`
      : `${apiBase}/contacts/`;

    const contactRes = await fetch(contactUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(contactBody)
    });
    if (!contactRes.ok) {
      const text = await contactRes.text();
      console.error('GHL contact error', contactRes.status, text);
      res.status(502).json({ error: 'Failed to create contact' });
      return;
    }
    const contactJson = await contactRes.json().catch(() => ({}));
    const contactId = contactJson?.contact?.id || contactJson?.id || contactJson?.contactId;

    // 2) Optionally create opportunity if pipeline configured
    const pipelineId = process.env.GHL_PIPELINE_ID;
    const pipelineStageId = process.env.GHL_PIPELINE_STAGE_ID; // optional
    if (pipelineId && contactId) {
      const oppUrl = process.env.PRIVATE_GHL_PROXY_URL
        ? `${process.env.PRIVATE_GHL_PROXY_URL.replace(/\/$/, '')}/opportunities/`
        : `${apiBase}/opportunities/`;
      const monetaryValue = role === 'student'
        ? Number(process.env.PRICE_STUDENT || 500)
        : Number(process.env.PRICE_PROFESSIONAL || 1000);
      const oppBody = {
        pipelineId,
        locationId,
        name: `${name} - ${role}`,
        status: 'open',
        contactId,
        monetaryValue,
        ...(pipelineStageId ? { pipelineStageId } : {})
      };
      const oppRes = await fetch(oppUrl, { method: 'POST', headers, body: JSON.stringify(oppBody) });
      if (!oppRes.ok) {
        const text = await oppRes.text();
        console.warn('GHL opportunity warn', oppRes.status, text);
      }
    }

    // Decide redirect URL based on role
    const studentUrl = process.env.XENDIT_STUDENT_LINK;
    const proUrl = process.env.XENDIT_PROFESSIONAL_LINK;
    const redirectUrl = role === 'student' ? studentUrl : proUrl;
    if (!redirectUrl) {
      res.status(500).json({ error: 'Payment link not configured' });
      return;
    }

    // Optionally append non-sensitive tracking
    const url = new URL(redirectUrl);
    if (utms && typeof utms === 'object') {
      Object.entries(utms).forEach(([k, v]) => { if (v) url.searchParams.set(k, String(v)); });
    }
    url.searchParams.set('r', role);

    res.status(200).json({ redirectUrl: url.toString() });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Internal server error' });
  }
}


