const {
  createOrder,
  getAllOrder,
  getSingleOrder,
  deleteOrder,
} = require("../controllers/orderController");

const express = require("express");

const router = express.Router();

router.route("/").post(createOrder).get(getAllOrder);

router.route("/:id").delete(deleteOrder).get(getSingleOrder);

module.exports = router;
