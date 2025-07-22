export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*'); // מאפשר לכולם לבקש, אפשר לשים גם דומיין ספציפי
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // תגובה לבקשות CORS preflight
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { deliveryId } = req.body;

  if (!deliveryId) {
    return res.status(400).json({ error: 'Missing deliveryId' });
  }

  try {
    const response = await fetch('https://api.cargo.co.il/Webservice/CheckShipmentStatusAndTimeRequest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deliveryId: Number(deliveryId) }),
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Error from cargo API' });
    }

    const data = await response.json();

    return res.status(200).json({
      status: data.deliveryStatus,
      statusText: data.DeliveryStatusText,
      deliveryTime: data.DiliveryTime,
      errorMsg: data.errorMsg || null,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
}
