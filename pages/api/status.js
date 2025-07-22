export default async function handler(req, res) {
  // טיפול ב-CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // תשובה מהירה ל-preflight
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
      status: data.deliveryStatus ?? null,
      statusText: data.DeliveryStatusText ?? 'לא ידוע',
      deliveryTime: data.DiliveryTime ?? 'לא זמין',
      errorMsg: data.errorMsg ?? null,
      rawData: data
    });
  } catch (error) {
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
}
