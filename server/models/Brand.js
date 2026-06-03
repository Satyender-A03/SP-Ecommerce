const mongoose = require("mongoose");
const brandSchema = new mongoose.Schema({
  image: [
    {
      type: String,
      required: true,
    },
  ],
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

const Brand = mongoose.model("Brand", brandSchema);
module.exports = Brand;
