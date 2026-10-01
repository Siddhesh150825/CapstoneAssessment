const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  guests: { type: Number, required: true, min: 1 }
});

module.exports = mongoose.model("Reservation", reservationSchema);
