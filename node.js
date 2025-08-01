require('dotenv').config({ override: true });
const stripeLib = require('stripe');
const stripe = new stripeLib(process.env.STRIPE_SECRET_KEY);
const express = require('express');
const app = express();

app.use(express.json());

app.post('/create-checkout-session', async (req, res) => {
  const userAmount = req.body.amount;

  if (!userAmount || isNaN(userAmount) || userAmount < 1 || userAmount > 1000) {
    return res.status(400).json({ error: 'Invalid payment amount. dont be a dickhead has to be atleast $1' });
  }

  const amountInCents = Math.round(userAmount * 100);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Cool Thing',
        },
        unit_amount: amountInCents,
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: 'https://virtuoushighpurchase.com/success',
    cancel_url: 'https://virtuoushighpurchase.com/cancel',
  });

  res.json({ id: session.id });
});

app.listen(4242, () => console.log('Server running on port 4242'));