const express = require("express");
const Stripe = require("stripe");
require("dotenv").config();
const app = express();
app.use(express.json());
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Hello Stripe payment",
  });
});

app.post("/payment", async (req, res) => {
  const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 500,
    currency: "usd",
    payment_method_types: ["card"],
    receipt_email: "dusingizimanaevariste3@gmail.com",
    description: "Test payment with stripe API",
  });
  const card = {
    number: "4242424242424242",
    exp_month: 12,
    exp_year: 2024,
    cvc: "123",
  };
  const paymentMethod = await stripe.paymentMethods.create({
    type: "card",
    card: card,
  });

  const confirmPayment = await stripe.paymentIntents.confirm(paymentIntent.id, {
    payment_method: paymentMethod.id,
  });
  if (confirmPayment.status === "succeeded") {
    res.status(200).json({
      status: "success",
      message: "Payment successful",
    });
  } else {
    res.status(400).json({
      status: "failed",
      message: "Payment failed",
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
