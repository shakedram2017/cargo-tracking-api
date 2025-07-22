export default async function handler(req, res) {
  const { deliveryNumber } = req.body;

  const response = await fetch("https://cargo-ship.co.il/Baldar/DeliveryStatus.aspx/GetStatus", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ deliveryNumber, customerCode: -1 }),
  });

  const data = await response.json();
  res.status(200).json(data);
}
