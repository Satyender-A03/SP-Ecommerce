const Review = require("../models/Review");

const createReview = async (req, res) => {
  try {
    const { userId, productId, rating, reviews } = req.body;

    if (!userId || !productId || rating == null || !reviews) {
      return res.status(400).json({ message: "All Fields Are Required" });
    }

    const duplicate = await Review.findOne({ userId, productId });
    if (duplicate) {
      return res.status(400).json({ message: "Review Already Exists" });
    }

    // 🔥 uploaded photos
    const photos = req.files ? req.files.map((f) => f.filename) : [];

    const review = new Review({ userId, productId, rating, reviews, photos });
    await review.save();

    return res.status(200).json({ message: "Review Added Successfully" });
  } catch (error) {
    return res.status(500).json({ message: "SERVER ERROR" });
  }
};

const getSingleReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id)
      .populate("userId", "fName lName uName")
      .populate("productId", "title");

    if (!review) return res.status(400).json({ message: "Review Not Found" });
    res.json(review);
  } catch (error) {
    return res.status(500).json({ message: "SERVER ERROR" });
  }
};

const getAllReviews = async (req, res) => {
  try {
    const data = await Review.find({})
      .populate("userId", "fName lName uName")
      .populate("productId", "title");

    if (!data?.length)
      return res.status(400).json({ message: "Reviews Not Found" });
    res.json(data);
  } catch (error) {
    return res.status(500).json({ message: "SERVER ERROR" });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const reviews = await Review.find({ productId: id })
      .populate("userId", "fName lName uName")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    return res.status(500).json({ message: "SERVER ERROR" });
  }
};

const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, reviews } = req.body;

    const review = await Review.findById(id);
    if (!review) return res.status(400).json({ message: "Review not found" });

    if (rating) review.rating = rating;
    if (reviews) review.reviews = reviews;

    await review.save();
    return res.status(200).json({ message: "Review updated Successfully" });
  } catch (error) {
    return res.status(500).json({ message: "SERVER ERROR" });
  }
};

const deleteReiview = async (req, res) => {
  try {
    const { id } = req.params;
    await Review.findByIdAndDelete(id);
    return res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "SERVER ERROR" });
  }
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  getProductReviews,
  updateReview,
  deleteReiview,
};
