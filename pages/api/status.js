export default function handler(req, res) {
  // אפשרויות CORS בסיסיות - מתאים לGET בלבד, ומאפשר דומיין ספציפי
  res.setHeader('Access-Control-Allow-Origin', 'https://velorejewelry.co.il');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    // תגובה לבקשת OPTIONS (preflight)
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({ message: 'ה-API עובד!' });
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
