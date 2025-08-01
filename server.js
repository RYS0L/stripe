const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');

const app = express();
require('dotenv').config({ path: './secret.env' });
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.use(cors({
  origin: [
    'https://www.virtuoushighpurchase.com',
    'https://rys0l.github.io.'
  ],
  optionsSuccessStatus: 200
}));
app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
  const { amount } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: 'UBEREAATS' },
          unit_amount: Math.round(Number(amount) * 100), 
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: 'https://www.virtuoushighpurchase.com/success.html',
      cancel_url: 'https://www.virtuoushighpurchase.com/cancel.html',
    });
    res.json({ id: session.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/test-cors', (req, res) => {
  res.json({ message: "CORS is working!" });
});

app.use(express.static('.'));

app.listen(process.env.PORT || 3000, () => {
  console.log('Server running');
});