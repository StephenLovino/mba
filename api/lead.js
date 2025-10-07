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
    
    const { name, email, role, utms, participants } = body;
    if (!name || !email || !role) {
      res.status(400).json({ error: 'Missing required fields' });
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
      'Version': '2021-07-28',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    };

    // 1) Create or upsert contact
    const [firstName, ...rest] = String(name || '').trim().split(' ');
    const lastName = rest.join(' ').trim() || undefined;
    const contactBody = {
      name,
      firstName: firstName || undefined,
      lastName,
      email,
      locationId,
      source: 'public api',
      tags: ['MBA Lead', role]
    };
    const contactUrl = `${apiBase}/contacts/`;

    let contactRes;
    try {
      console.log('GHL Request:', { url: contactUrl, headers, body: contactBody });
      contactRes = await fetch(contactUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(contactBody)
      });
    } catch (err) {
      console.error('GHL fetch failed:', {
        error: err?.message || String(err),
        cause: err?.cause,
        url: contactUrl,
        hasToken: Boolean(ghlToken),
        locationId,
        stack: err?.stack
      });
      res.status(502).json({ 
        error: 'Upstream fetch failed', 
        reason: err?.message || String(err), 
        url: contactUrl, 
        hasToken: Boolean(ghlToken), 
        locationId,
        details: err?.cause || err?.stack
      });
      return;
    }
    
    const rawContactText = await contactRes.text();
    let contactJson = {};
    try { 
      contactJson = JSON.parse(rawContactText || '{}'); 
    } catch (parseErr) {
      console.error('GHL response parse error:', parseErr);
    }
    
    console.log('GHL Response:', {
      status: contactRes.status,
      statusText: contactRes.statusText,
      headers: Object.fromEntries(contactRes.headers.entries()),
      body: rawContactText,
      parsed: contactJson
    });
    
    if (!contactRes.ok) {
      console.error('GHL contact creation failed:', {
        status: contactRes.status,
        statusText: contactRes.statusText,
        response: rawContactText,
        parsed: contactJson,
        request: { url: contactUrl, headers, body: contactBody }
      });
      res.status(502).json({ 
        error: 'Failed to create contact', 
        status: contactRes.status,
        statusText: contactRes.statusText,
        details: contactJson || rawContactText,
        request: { url: contactUrl, hasToken: Boolean(ghlToken), locationId }
      });
      return;
    }
    const contactId = contactJson?.contact?.id || contactJson?.id || contactJson?.contactId;

    // Optionally create/update additional contacts for student participants
    if (role === 'student' && Array.isArray(participants) && participants.length) {
      const cleaned = participants
        .map(p => ({ name: String(p.name||'').trim(), email: String(p.email||'').trim() }))
        .filter(p => p.name && /.+@.+\..+/.test(p.email));
      for (const p of cleaned) {
        const [pf, ...pr] = p.name.split(' ');
        const pl = pr.join(' ').trim() || undefined;
        const body = {
          name: p.name,
          firstName: pf || undefined,
          lastName: pl,
          email: p.email,
          locationId,
          source: 'public api',
          tags: ['MBA Lead', 'student', 'participant']
        };
        const url = `${apiBase}/contacts/`;
        try {
          await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
        } catch {}
      }
    }

    // 2) Optionally create opportunity if pipeline configured
    const pipelineId = process.env.GHL_PIPELINE_ID;
    const pipelineStageId = process.env.GHL_PIPELINE_STAGE_ID; // optional
    if (pipelineId && contactId) {
      const oppUrl = `${apiBase}/opportunities/`;
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

    // Use static payment links with success redirect tracking
    // Check if we're in test mode (for staging)
    const isTestMode = req.headers['x-test-mode'] === 'true' || req.query.test === 'true';
    
    const studentUrl = isTestMode ? 
      (process.env.XENDIT_STUDENT_STAGING_LINK || 'https://checkout-staging.xendit.co/od/student') :
      process.env.XENDIT_STUDENT_LINK;
    const proUrl = isTestMode ? 
      (process.env.XENDIT_PROFESSIONAL_STAGING_LINK || 'https://checkout-staging.xendit.co/od/professional') :
      process.env.XENDIT_PROFESSIONAL_LINK;
    const chosen = role === 'student' ? studentUrl : proUrl;
    if (!chosen) {
      res.status(200).json({ created: true, contactId, redirectUrl: null, contact: contactJson });
      return;
    }

    // Add email and role to success URL for tracking
    const url = new URL(chosen);
    if (utms && typeof utms === 'object') {
      Object.entries(utms).forEach(([k, v]) => { if (v) url.searchParams.set(k, String(v)); });
    }
    url.searchParams.set('r', role);
    url.searchParams.set('email', email);
    url.searchParams.set('success_url', `${process.env.VERCEL_URL || 'https://aihero.millennialbusinessacademy.net'}/eticket?t=${role}&email=${encodeURIComponent(email)}`);

    res.status(200).json({ created: true, contactId, redirectUrl: url.toString(), contact: contactJson });
  } catch (e) {
    console.error('lead api fatal', e && (e.stack || e.message || e));
    res.status(500).json({ error: 'Internal server error', message: e?.message || String(e) });
  }
}


