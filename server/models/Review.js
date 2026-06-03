const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  product: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  rating: {
    type: Number,
    required: true,
  },
  review: {
    type: String,
    default: "true",
  },
});
const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
