const Order = require("../models/Order");

const createOrder = async (req, res) => {
  try {
    const { userId, productId, price, qty, color, paymentId } = req.body;
    if (!userId || !productId || !price || !qty || !color || !paymentId) {
      return res.status(400).json({ message: "All fields Are required" });
    }

    const orderObj = {
      userId,
      productId,
      price,
      qty,
      color,
      paymentId,
    };

    const order = new Order(orderObj);
    await order.save();

    if (order) {
      return res.status(200).json({ message: "Order Added" });
    }
  } catch (error) {
    return res.status(500).json({ message: "SERVER ERROR" });
  }
};

const getAllOrder = async (req, res) => {
  try {
    const data = await Order.find({});

    if (!data?.length) {
      return res.status(400).json({ message: "Order Not Found" });
    }
    res.json(data);
  } catch (error) {
    return res.status(500).json({ message: "SERVER ERROR" });
  }
};

const getSingleOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({ _id: id });

    if (!order) {
      return res.status(400).json({ message: "Order Not Found" });
    }
    res.json(order);
  } catch (error) {
    return res.status(400).json({ message: "SERVER ERROR" });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const del = await Order.findOneAndDelete({ _id: id });

    return res.status(200).json({ message: "Order Deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ message: "SERVER ERROR" });
  }
};

module.exports = { createOrder, getAllOrder, getSingleOrder, deleteOrder };
