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

    const reviewObj = {
      userId,
      productId,
      rating,
      reviews,
    };

    const review = new Review(reviewObj);
    await review.save();
    return res.status(200).json({ message: "Review Added Successfully" });
  } catch (error) {
    return res.status(500).json({ message: "SERVER ERROR" });
  }
};

const getSingleReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findOne({ _id: id });

    if (!review) {
      return res.status(400).json({ message: "Review Not Found" });
    }
    res.json(review);
  } catch (error) {
    return res.status(500).json({ message: "SERVER ERROR" });
  }
};

const getAllReviews = async (req, res) => {
  try {
    const data = await Review.find({});

    if (!data?.length) {
      return res.status(400).json({ message: "Reviews Not Found" });
    }
    res.json(data);
  } catch (error) {
    return res.status(500).josn({ message: "SERVER ERROR" });
  }
};

const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, productId, rating, reviews } = req.body;
    const review = await Review.findOne({ _id: id });
    if (!review) {
      return res.status(400).json({ message: "Review not found" });
    }

    const duplicate = await Review.findOne(userId);
    if (duplicate) {
      return res
        .status(400)
        .json({ message: "Review with same user already exist " });
    }

    review.userId = userId;
    review.product = productId;
    review.rating = rating;
    review.review = reviews;

    await review.save();
    return res.status(200).json({ message: "Review updated Successfully" });
  } catch (error) {
    return res.status(500).json({ message: "SERVER ERROR" });
  }
};

const deleteReiview = async (req, res) => {
  try {
    const { id } = req.params;
    const del = await Review.findOneAndDelete({ _id: id });

    return res.status(200).json({ message: "Review delete successfully" });
  } catch (error) {
    return res.status(500).json({ message: "SERVER ERROR" });
  }
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReiview,
};
