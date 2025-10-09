/**
 * API endpoint to create a Xendit invoice
 * This creates a unique payment link for each user with pre-filled information
 */

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Parse request body
    let body = {};
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      res.status(400).json({ error: 'Invalid JSON', details: parseError.message });
      return;
    }

    const { email, name, role, organization, yearInCollege, participantEmails } = body;

    // Validate required fields
    if (!email || !name || !role) {
      res.status(400).json({ error: 'Missing required fields: email, name, role' });
      return;
    }

    console.log('Create invoice request:', { email, name, role, organization, yearInCollege, participantEmails });

    // Get Xendit secret key
    const xenditSecretKey = process.env.XENDIT_SECRET_KEY;
    if (!xenditSecretKey) {
      console.error('XENDIT_SECRET_KEY not configured');
      res.status(500).json({ error: 'Payment system not configured' });
      return;
    }

    // Determine amount based on role
    const amount = role === 'student' ? 500 : 1000;
    const description = role === 'student' 
      ? 'Millennial Business Academy - Student Registration'
      : 'Millennial Business Academy - Professional Registration';

    // Create invoice data
    const invoiceData = {
      external_id: `MBA-${role}-${Date.now()}-${email.replace(/[^a-zA-Z0-9]/g, '')}`,
      amount: amount,
      payer_email: email,
      description: description,
      invoice_duration: 86400, // 24 hours
      currency: 'PHP',
      reminder_time: 1,
      success_redirect_url: `${getBaseUrl(req)}/eticket?email=${encodeURIComponent(email)}&role=${role}&org=${encodeURIComponent(organization || '')}&year=${encodeURIComponent(yearInCollege || '')}&name=${encodeURIComponent(name)}${participantEmails && participantEmails.length > 0 ? `&participants=${encodeURIComponent(participantEmails.join(','))}` : ''}`,
      failure_redirect_url: `${getBaseUrl(req)}/checkout-${role}?email=${encodeURIComponent(email)}&org=${encodeURIComponent(organization || '')}&year=${encodeURIComponent(yearInCollege || '')}&name=${encodeURIComponent(name)}&error=payment_failed`,
      customer: {
        given_names: name,
        email: email,
      },
      customer_notification_preference: {
        invoice_created: ['email'],
        invoice_reminder: ['email'],
        invoice_paid: ['email'],
      },
      items: [
        {
          name: description,
          quantity: 1,
          price: amount,
          category: 'Event Registration'
        }
      ],
      fees: [],
      metadata: {
        email: email,
        role: role,
        organization: organization || '',
        yearInCollege: yearInCollege || '',
        name: name,
        source: 'MBA Registration Form',
        // Store participant emails for tagging after payment
        ...(participantEmails && participantEmails.length > 0 && {
          participantEmails: JSON.stringify(participantEmails)
        })
      }
    };

    console.log('Creating Xendit invoice:', {
      external_id: invoiceData.external_id,
      amount: invoiceData.amount,
      email: invoiceData.payer_email,
      role: role
    });

    // Call Xendit API to create invoice
    const xenditResponse = await fetch('https://api.xendit.co/v2/invoices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(xenditSecretKey + ':').toString('base64')}`
      },
      body: JSON.stringify(invoiceData)
    });

    const responseText = await xenditResponse.text();
    let xenditData;
    
    try {
      xenditData = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse Xendit response:', responseText);
      res.status(502).json({ 
        error: 'Invalid response from payment provider',
        details: responseText.substring(0, 200)
      });
      return;
    }

    if (!xenditResponse.ok) {
      console.error('Xendit API error:', {
        status: xenditResponse.status,
        response: xenditData
      });
      res.status(xenditResponse.status).json({ 
        error: 'Failed to create invoice',
        details: xenditData
      });
      return;
    }

    console.log('Xendit invoice created successfully:', {
      id: xenditData.id,
      invoice_url: xenditData.invoice_url,
      external_id: xenditData.external_id
    });

    // Return the invoice URL
    res.status(200).json({
      success: true,
      invoice_id: xenditData.id,
      invoice_url: xenditData.invoice_url,
      external_id: xenditData.external_id,
      amount: xenditData.amount,
      status: xenditData.status
    });

  } catch (error) {
    console.error('Create invoice error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error?.message || String(error)
    });
  }
}

/**
 * Helper function to get the base URL of the application
 */
function getBaseUrl(req) {
  // PRIORITY 1: Use production URL if explicitly set (for payment redirects)
  if (process.env.PRODUCTION_URL) {
    return process.env.PRODUCTION_URL;
  }

  // PRIORITY 2: Check if we have a custom domain from the request
  const host = req.headers.host;
  if (host && !host.includes('vercel.app')) {
    // Only use host if it's a custom domain, not a Vercel preview URL
    const protocol = host.includes('localhost') ? 'http' : 'https';
    return `${protocol}://${host}`;
  }

  // PRIORITY 3: Check if we're on Vercel (this will be preview URLs)
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // PRIORITY 4: Fallback for local development
  return 'http://localhost:3000';
}

