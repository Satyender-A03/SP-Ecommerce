const express = require("express");
const {
  register,
  login,
  refresh,
  logout,
  getUser,
  getAllUsers,
  getUserById,
  deleteUser,
  forgotPassword,
  verifyOtp,
  resetPassword,
  updateUser,
} = require("../controllers/authController");
const verifyJWT = require("../middleware/verifyJWT");

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/refresh").post(refresh);
router.route("/logout").post(logout);
router.route("/forgot-password").post(forgotPassword);
router.route("/verify-otp").post(verifyOtp);
router.route("/reset-password").post(resetPassword);
router.route("/update/:id").put(updateUser);

// 🔥 Admin — must come BEFORE "/:id", otherwise "users" gets treated as an :id
router.route("/users").get(getAllUsers);
router.route("/users/:id").get(getUserById).delete(deleteUser);

router.route("/:id").get(verifyJWT, getUser); // ← sabse baad — warna :id sab match kar leta

module.exports = router;
