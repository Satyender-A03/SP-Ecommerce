const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    productId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    price: { type: Number, required: true },
    qty: { type: Number, default: 1 },
    color: { type: String, default: "-" },
    size: { type: String, default: "-" },
    paymentId: { type: String },
    status: { type: String, default: "Processing" },
    awbCode: { type: String, default: "" }, // 🔥 Shiprocket tracking
    shiprocketOrderId: { type: String, default: "" }, // 🔥 Shiprocket order ID
  },
  { timestamps: true },
);

module.exports = mongoose.model("Order", orderSchema);
