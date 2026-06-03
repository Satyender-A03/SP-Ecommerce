const multer = require("multer");
const express = require("express");
const router = express.Router();

const {
  getAllProducts,
  createProduct,
  updateProduct,
  getSingleProduct,
  deleteProduct,
} = require("../controllers/productController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/product");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.get("/", getAllProducts);
router.get("/:id", getSingleProduct);
router.delete("/:id", deleteProduct);

router.post("/upload", upload.array("image", 5), createProduct);
router.patch("/:id", upload.array("image", 5), updateProduct);

module.exports = router;
