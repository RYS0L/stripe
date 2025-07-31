const stripe = require('stripe')('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');
const express = require('express');
const app = express();

app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Cool Thing',
        },
        unit_amount: 2000,
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: 'https://virtuoushighpurchase.com/success',
    cancel_url: 'https://virtuoushighpurchase/cancel',
  });

  res.json({ id: session.id });
});

app.listen(4242, () => console.log('Server running on port 4242'));