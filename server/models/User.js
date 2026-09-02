const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fName: { type: String, required: true },
    lName: { type: String, required: true },
    uName: { type: String, required: true, unique: true }, // 🔥 unique
    email: { type: String, required: true, unique: true }, // 🔥 unique
    password: { type: String, required: true },
    phone: { type: String, required: true }, // 🔥 String — Number me leading zeros lost hote hain
    address: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }, // 🔥 adds createdAt / updatedAt automatically
);

const User = mongoose.model("User", userSchema);
module.exports = User;
