const express = require("express");
const {
  register,
  login,
  refresh,
  logout,
  getUser,
} = require("../controllers/authController");
const verifyJWT = require("../middleware/verifyJWT");

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/refresh").post(refresh);
router.route("/logout").post(logout);
router.route("/:id").get(verifyJWT, getUser);

module.exports = router;
