const express = require("express");
const {
  adminLogin,
  registerAdmin,
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
  createAdmin,
  getPublicStoreInfo,
} = require("../controllers/adminController");
const verifyJWT = require("../middleware/verifyJWT"); // shared middleware — handles both user and admin tokens

const router = express.Router();

router.route("/login").post(adminLogin);
router.route("/register").post(registerAdmin); // public — only works if zero admins exist
router.route("/store-info").get(getPublicStoreInfo); // public — no auth, read-only

// Protected — needs a valid admin token
router.route("/profile").get(verifyJWT, getAdminProfile);
router.route("/profile").put(verifyJWT, updateAdminProfile);
router.route("/change-password").put(verifyJWT, changeAdminPassword);
router.route("/create").post(verifyJWT, createAdmin);

module.exports = router;
