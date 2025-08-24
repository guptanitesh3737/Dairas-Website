const express = require("express");
const app = express();
const stripe = require("stripe")("YOUR_STRIPE_SECRET_KEY");
app.use(express.json());

app.post("/create-checkout-session", async (req, res) => {
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: req.body.cart.map(item => ({
            price_data: {
                currency: "npr",
                product_data: { name: item.product },
                unit_amount: item.price * 100
            },
            quantity: 1
        })),
        mode: "payment",
        success_url: "https://yourwebsite.com/success.html",
        cancel_url: "https://yourwebsite.com/cancel.html"
    });
    res.json({ id: session.id });
});

app.listen(3000, () => console.log("Server running on port 3000"));
