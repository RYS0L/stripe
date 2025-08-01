const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');

const app = express();
require('dotenv').config({ path: './secret.env' });
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
  const { amount } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: { name: 'Virtuous High Purchase' },
          unit_amount: Math.round(Number(amount) * 100), // amount in cents
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: 'http://localhost:3000/success.html',
      cancel_url: 'http://localhost:3000/cancel.html',
    });
    res.json({ id: session.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use(express.static('.')); // Serves your index.html

app.listen(3000, () => console.log('Server running on http://localhost:3000'));