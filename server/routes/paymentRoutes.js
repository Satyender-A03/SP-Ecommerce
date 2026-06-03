const Razorpay = require("razorpay");
const express = require("express");
const router = express.Router();
const crypto = require("crypto");

router.post("/", async (req, res) => {
  try {
    const { totalPrice } = req.body;

    if (!totalPrice) {
      return res.status(400).json({ message: "Total price is required" });
    }

    const instance = new Razorpay({
      key_id: "rzp_test_3WbPzeexWFf3Wx",
      key_secret: "rmqFwXefGDhqePUbLLjIBRtL",
    });

    const options = {
      amount: totalPrice * 100,
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    const order = await instance.orders.create(options);

    if (!order) {
      return res.status(500).json({ message: "Order could not be created" });
    }

    res.status(200).json(order);
  } catch (err) {
    console.error("Payment Error:", err);
    res.status(500).json({
      message: "Server error during payment",
      error: err.message,
    });
  }
});

module.exports = router;
