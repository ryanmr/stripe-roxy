import express from "express";
import cors from "cors";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY ?? "";

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2020-08-27",
});

const app = express();
app.use(express.json());
app.use(cors());

const FRONTEND_BASE = "http://localhost:8080";

app.get("/", function (req, res) {
  res.json({
    project: "stripe-roxy",
    time: Date.now(),
  });
});

const products = [
  {
    type: "treat",
    productId: "prod_JHez7JndbhNwp7",
  },
  { type: "adventure" },
  { type: "toy" },
];

app.post("/create-checkout-session", async (req, res) => {
  const itemType = req.body?.itemType; // would fail otherwise
  const itemValue = req.body?.itemValue; // would fail otherwise

  if (!itemType || !itemValue) {
    res.status(400).json({
      message: "item or tier was not found",
    });
    return;
  }

  const product = products.find((v) => v.type === itemType);
  const productId = product?.productId;

  const prices = await stripe.prices.list({ product: productId });

  if (!prices) {
    res.status(400).json({
      message: "item did not exist",
    });
    return;
  }

  const price = prices.data.find((v) => v.unit_amount === itemValue);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: price?.id,
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${FRONTEND_BASE}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${FRONTEND_BASE}/checkout/cancel`,
  });

  res.json({ id: session.id });
});

app.post("/order/review", async (req, res) => {
  const sessionId = req.body?.sessionId;

  if (!sessionId) {
    res.status(400).json({ message: "no session" });
    return;
  }
  const session = await stripe.checkout.sessions.retrieve(sessionId, {
    expand: ["line_items"],
  });
  if (!session || !session.customer) {
    res.status(401).json({ message: "no session found" });
    return;
  }

  const customer = await stripe.customers.retrieve(session.customer.toString());

  res.json({ customer });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.info(`server is ready on ${port}`);
});
