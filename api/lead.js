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

    // Push to GHL via your private integration endpoint
    // Expect env vars: GHL_API_BASE, GHL_LOCATION_ID, GHL_API_KEY or PRIVATE_PROXY_URL
    const apiUrl = process.env.PRIVATE_GHL_PROXY_URL || process.env.GHL_API_BASE;
    if (!apiUrl) {
      res.status(500).json({ error: 'GHL integration not configured' });
      return;
    }

    const payload = {
      name,
      email,
      role,
      utms: utms || {},
      locationId: process.env.GHL_LOCATION_ID || undefined
    };

    const headers = { 'Content-Type': 'application/json' };
    if (process.env.GHL_API_KEY) headers['Authorization'] = `Bearer ${process.env.GHL_API_KEY}`;

    const ghlRes = await fetch(`${apiUrl.replace(/\/$/, '')}/contacts/upsert`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    if (!ghlRes.ok) {
      const text = await ghlRes.text();
      console.error('GHL error', ghlRes.status, text);
      res.status(502).json({ error: 'Failed to sync with CRM' });
      return;
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


