const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    uName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "admin" },
    notificationPrefs: {
      newOrder: { type: Boolean, default: true },
      lowStock: { type: Boolean, default: true },
      newUser: { type: Boolean, default: false },
      marketing: { type: Boolean, default: false },
    },
    storeSettings: {
      storeName: { type: String, default: "ShopEase" },
      supportEmail: { type: String, default: "" },
      currency: { type: String, default: "INR" },
      shippingCharge: { type: Number, default: 50 },
    },
  },
  { timestamps: true },
);

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
