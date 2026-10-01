const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem" },
      quantity: { type: Number, required: true }
    }
  ],
  status: { 
    type: String, 
    enum: ["Preparing", "Ready", "Delivered"], 
    default: "Preparing" 
  },
  createdAt: { type: Date, default: Date.now },
  deliveredAt: { type: Date }
});

module.exports = mongoose.model("Order", orderSchema);
