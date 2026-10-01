const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  category: { type: String, default: "General" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("MenuItem", menuItemSchema);

