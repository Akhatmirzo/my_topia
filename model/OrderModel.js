const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  products: {
    type: Array,
    required: true,
  },
  total_price: {
    type: Number,
    required: true,
  },
  table_number: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: "PENDING",
    enum: ["PENDING", "PROCESSING", "CONFIRMED", "CENCELLED", "FAILED"],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
