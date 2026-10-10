const express = require("express");
const Feedback = require("../models/Feedback");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth(["customer"]), async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ error: "Rating and comment are required" });
    }

    const feedback = new Feedback({
      customerId: req.user._id,
      rating,
      comment
    });

    await feedback.save();
    const populatedFeedback = await feedback.populate("customerId", "name email");
    res.json(populatedFeedback);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const feedbacks = await Feedback.find().populate("customerId", "name email");
    res.json(feedbacks);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/my-feedback", auth(["customer"]), async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ customerId: req.user.id }).populate("customerId", "name email");
    res.json(feedbacks);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/:id", auth(["customer", "admin"]), async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    if (req.user.role === "customer" && feedback.customerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed to edit others' feedback" });
    }

    feedback.comment = req.body.comment || feedback.comment;
    feedback.rating = req.body.rating || feedback.rating;
    await feedback.save();
    const populatedFeedback = await feedback.populate("customerId", "name email");
    res.json(populatedFeedback);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", auth(["customer", "admin"]), async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    if (req.user.role === "customer" && feedback.customerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed to delete others' feedback" });
    }

    await feedback.deleteOne();
    res.json({ message: "Feedback deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
