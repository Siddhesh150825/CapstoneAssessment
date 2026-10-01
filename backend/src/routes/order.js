const express = require("express");
const Order = require("../models/Order");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/", auth(["customer"]), async (req, res) => {
  try {
    const order = new Order({
      customerId: req.user.id,
      items: req.body.items,
    });
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/my-orders", auth(["customer"]), async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: "Error fetching orders" });
  }
});

router.get("/", auth(["admin"]), async (req, res) => {
  try {
    const orders = await Order.find().populate("items.menuItemId");
    res.json(orders);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/:id/status", auth(["admin"]), async (req, res) => {
  try {
    const { status } = req.body;
    const update = { status };
    if (status === "Delivered") {
      update.deliveredAt = new Date();
    }
    const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/history/:customerId", auth(["customer"]), async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.params.customerId, status: "Delivered" });
    res.json(orders);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;