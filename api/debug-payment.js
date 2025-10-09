// Debug endpoint to see what data is being sent to payment-success
export default async function handler(req, res) {
  console.log('=== DEBUG PAYMENT REQUEST ===');
  console.log('Method:', req.method);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Body:', JSON.stringify(req.body, null, 2));
  console.log('Query:', JSON.stringify(req.query, null, 2));
  
  res.status(200).json({
    method: req.method,
    headers: req.headers,
    body: req.body,
    query: req.query
  });
}

