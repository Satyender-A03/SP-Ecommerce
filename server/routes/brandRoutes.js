const multer = require("multer");

const {
  createBrand,
  getAllBrands,
  getSingleBrand,
  updateBrand,
  deleteBrand,
} = require("../controllers/brandController");

const express = require("express");
const router = express.Router();

router.route("/").get(getAllBrands);
router.route("/:id").delete(deleteBrand).get(getSingleBrand);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/brand");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.route("/upload").post(upload.single("image"), createBrand);
router.route("/:id").patch(upload.single("image"), updateBrand);

module.exports = router;
