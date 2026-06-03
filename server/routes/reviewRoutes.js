const {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReiview,
} = require("../controllers/reviewController");

const express = require("express");

const router = express.Router();

router.route("/").get(getAllReviews).post(createReview);
router
  .route("/:id")
  .delete(deleteReiview)
  .get(getSingleReview)
  .patch(updateReview);
module.exports = router;
