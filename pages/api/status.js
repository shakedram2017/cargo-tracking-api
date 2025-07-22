export default async function handler(req, res) {
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

    // תיקן שמות שדות בהתאם ל-API החיצוני + ברירת מחדל
    return res.status(200).json({
      status: data.deliveryStatus ?? null,
      statusText: data.DeliveryStatusText ?? 'לא ידוע',
      deliveryTime: data.DiliveryTime ?? 'לא זמין',  // שמור על שם השדה כפי שה-API מחזיר (יש טעות כתיב ב-DiliveryTime)
      errorMsg: data.errorMsg ?? null,
      rawData: data // אפשר להחזיר את כל התגובה לצורך בדיקות (לא חובה)
    });
  } catch (error) {
    return res.status(500).json({ error: 'Server error', details: error.message });
  }
}
