const express = require("express");
const router = express.Router();
const MenuItem = require("../models/MenuItem");
const User = require("../models/User");
const Order = require("../models/Order");
const Reservation = require("../models/Reservation");
const Feedback = require("../models/Feedback");

const auth = require("../middleware/auth");

router.post("/menu", auth(["admin"]), async (req, res) => {
  try {
    const { name, price, image } = req.body;
    const newItem = new MenuItem({ name, price, image });
    await newItem.save();
    res.json(newItem);
  } catch (err) {
    res.status(500).json({ message: "Error adding item" });
  }
});

router.get("/menu", auth(["admin"]), async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Error fetching menu" });
  }
});

router.put("/menu/:id", auth(["admin"]), async (req, res) => {
  try {
    const { name, price, image } = req.body;
    const updated = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { name, price, image },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating item" });
  }
});

router.delete("/menu/:id", auth(["admin"]), async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting item" });
  }
});

router.get("/users", auth(["admin"]), async (req, res) => {
  try {
    const User = require("../models/User");
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

router.put("/users/:id/role", auth(["admin"]), async (req, res) => {
  try {
    const User = require("../models/User");
    const { role } = req.body;

    if (!["customer", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error updating user role" });
  }
});


router.delete("/users/:id", auth(["admin"]), async (req, res) => {
  try {
    const User = require("../models/User");
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user" });
  }
});


router.get("/orders", auth(["admin"]), async (req, res) => {
  try {
    const orders = await Order.find().populate("items.menuItemId", "name price").populate("customerId", "name email");
    res.json(orders);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/reservations", auth(["admin"]), async (req, res) => {
  try {
    const reservations = await Reservation.find().populate("customerId", "name email").sort({ createdAt: -1 });
    res.json(reservations);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/feedback", auth(["admin"]), async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate("customerId", "name email").sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/orders/:id/status", auth(["admin"]), async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Error updating order status" });
  }
});

router.delete("/reservations/:id", auth(["admin"]), async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);
    if (!reservation) return res.status(404).json({ message: "Reservation not found" });
    res.json({ message: "Reservation deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting reservation" });
  }
});

router.delete("/feedback/:id", auth(["admin"]), async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) return res.status(404).json({ message: "Feedback not found" });
    res.json({ message: "Feedback deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting feedback" });
  }
});



module.exports = router;
