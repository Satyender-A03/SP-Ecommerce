const Order = require("../models/Order");
const { createShiprocketOrder, trackOrder } = require("../utils/shiprocket");

// ── CREATE ORDER ──────────────────────────────────────────────────────────────
const createOrder = async (req, res) => {
  try {
    const {
      userId,
      productId,
      price,
      qty,
      color,
      size,
      paymentId,
      shippingInfo,
      allItems,
      subtotal,
    } = req.body;

    const order = await Order.create({
      userId,
      productId,
      price,
      qty: qty || 1,
      color: color || "-",
      size: size || "-",
      paymentId,
      status: "Processing",
    });

    // 🔥 Shiprocket order create — fire and forget
    if (shippingInfo && allItems) {
      createShiprocketOrder({
        orderId: paymentId + "_" + Date.now(),
        name: shippingInfo.name,
        email: shippingInfo.email,
        phone: shippingInfo.phone,
        address: shippingInfo.address,
        city: shippingInfo.city,
        state: shippingInfo.state,
        pincode: shippingInfo.pincode,
        items: allItems,
        subtotal: subtotal || price * qty,
      })
        .then(async (srOrder) => {
          if (srOrder.awb_code) {
            await Order.findByIdAndUpdate(order._id, {
              awbCode: srOrder.awb_code,
              shiprocketOrderId: srOrder.order_id,
              status: "Confirmed",
            });
          }
        })
        .catch((err) => console.log("❌ Shiprocket error:", err.message));
    }

    return res
      .status(201)
      .json({ message: "Order Created Successfully", order });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "SERVER ERROR", error: error.message });
  }
};

// ── GET ALL ORDERS ────────────────────────────────────────────────────────────
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    return res.status(200).json(orders);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "SERVER ERROR", error: error.message });
  }
};

// ── TRACK ORDER ───────────────────────────────────────────────────────────────
const getTracking = async (req, res) => {
  try {
    const { awb } = req.params;
    if (!awb) return res.status(400).json({ message: "AWB code required" });
    const tracking = await trackOrder(awb);
    return res.status(200).json(tracking);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "SERVER ERROR", error: error.message });
  }
};

// ── UPDATE ORDER STATUS ───────────────────────────────────────────────────────
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found" });
    return res.status(200).json({ message: "Status updated", order });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "SERVER ERROR", error: error.message });
  }
};

module.exports = { createOrder, getAllOrders, getTracking, updateOrderStatus };
