// Simple in-memory session storage (for demo purposes)
// In production, you'd want to use Redis or a database
const sessions = new Map();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Store session data
    const { sessionId, email, role, organization, yearInCollege } = req.body;
    
    if (!sessionId || !email) {
      res.status(400).json({ error: 'Missing sessionId or email' });
      return;
    }
    
    sessions.set(sessionId, {
      email,
      role,
      organization,
      yearInCollege,
      timestamp: Date.now()
    });
    
    // Clean up old sessions (older than 1 hour)
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    for (const [id, data] of sessions.entries()) {
      if (data.timestamp < oneHourAgo) {
        sessions.delete(id);
      }
    }
    
    res.status(200).json({ success: true, sessionId });
    
  } else if (req.method === 'GET') {
    // Retrieve session data
    const { sessionId } = req.query;
    
    if (!sessionId) {
      res.status(400).json({ error: 'Missing sessionId' });
      return;
    }
    
    const sessionData = sessions.get(sessionId);
    
    if (!sessionData) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }
    
    res.status(200).json(sessionData);
    
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
