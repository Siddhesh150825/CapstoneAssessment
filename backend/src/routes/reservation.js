const express = require("express");
const Reservation = require("../models/Reservation");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth(["customer"]), async (req, res) => {
  try {
    const { date, time, guests } = req.body;

    if (!date || !time || !guests) {
      return res.status(400).json({ error: "All fields are required" });
    }

  const reservationDate = new Date(date);
  if (reservationDate < new Date().setHours(0, 0, 0, 0)) {
    return res.status(400).json({ message: "Date cannot be in the past." });
  }

  if (guests < 1) {
    return res.status(400).json({ message: "Guests must be at least 1." });
  }

  const [hours, minutes] = time.split(":").map(Number);
  if (hours < 10 || hours > 22) {
    return res.status(400).json({ message: "Reservations allowed only between 10:00 and 22:00." });
  }

  if (reservationDate.toDateString() === new Date().toDateString()) {
    const now = new Date();
    const selectedTime = new Date(reservationDate);
    selectedTime.setHours(hours, minutes, 0, 0);
    if (selectedTime < now) {
      return res.status(400).json({ message: "Time cannot be in the past." });
    }
  }

    const reservation = new Reservation({
      customerId: req.user.id,
      date,
      time,
      guests
    });

    await reservation.save();
    res.json(reservation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/my-reservations", auth(["customer"]), async (req, res) => {
  try {
    const reservations = await Reservation.find({ customerId: req.user.id });
    res.json(reservations);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", auth(["admin"]), async (req, res) => {
  try {
    const reservations = await Reservation.find().populate("customerId", "name email");
    res.json(reservations);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.put("/:id", auth(["admin"]), async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(reservation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", auth(["admin"]), async (req, res) => {
  try {
    await Reservation.findByIdAndDelete(req.params.id);
    res.json({ message: "Reservation deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;