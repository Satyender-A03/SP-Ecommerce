const express = require("express");
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getTracking,
  updateOrderStatus,
} = require("../controllers/orderController");

router.post("/", createOrder);
router.get("/", getAllOrders);
router.get("/track/:awb", getTracking);
router.put("/status/:id", updateOrderStatus);

module.exports = router;
