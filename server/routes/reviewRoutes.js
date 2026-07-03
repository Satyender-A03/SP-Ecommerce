const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  createReview,
  getAllReviews,
  getSingleReview,
  getProductReviews,
  updateReview,
  deleteReiview,
} = require("../controllers/reviewController");

// 🔥 Ensure folder exists before multer uses it
const reviewDir = path.join(__dirname, "../public/review");
if (!fs.existsSync(reviewDir)) {
  fs.mkdirSync(reviewDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/review"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) cb(null, true);
    else cb(new Error("Only images allowed"));
  },
});

router
  .route("/")
  .get(getAllReviews)
  .post(upload.array("photos", 3), createReview);
router.route("/product/:id").get(getProductReviews);
router
  .route("/:id")
  .delete(deleteReiview)
  .get(getSingleReview)
  .patch(updateReview);

module.exports = router;
