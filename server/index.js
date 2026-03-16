import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PAYPAL_API_BASE = 'https://api-m.paypal.com';
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

// 获取PayPal访问令牌
async function getPayPalAccessToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');

  const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  return data.access_token;
}

// 创建PayPal订单
app.post('/api/paypal/create-order', async (req, res) => {
  try {
    const { amount, currency, bookingId } = req.body;

    if (!amount || !bookingId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const accessToken = await getPayPalAccessToken();

    const orderResponse = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: currency || 'USD',
              value: amount.toFixed(2),
            },
            description: `Booking ${bookingId}`,
            custom_id: bookingId,
          },
        ],
      }),
    });

    const order = await orderResponse.json();

    if (!order.id) {
      throw new Error('Failed to create PayPal order');
    }

    res.json({ orderId: order.id });
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    res.status(500).json({ error: error.message });
  }
});

// 捕获PayPal订单（完成支付）
app.post('/api/paypal/capture-order', async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ error: 'Missing orderId' });
    }

    const accessToken = await getPayPalAccessToken();

    const captureResponse = await fetch(
      `${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const captureData = await captureResponse.json();

    if (captureData.status === 'COMPLETED') {
      res.json({ success: true, data: captureData });
    } else {
      throw new Error('Payment capture failed');
    }
  } catch (error) {
    console.error('Error capturing PayPal order:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

