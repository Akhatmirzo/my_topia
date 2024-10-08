const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  products: [
    {
      product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number },
      price: { type: Number },
      totalPrice: { type: Number },
      options: { type: Object },
      additions: { type: Array },
    },
  ],
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
    default: "pending",
    enum: ["pending", "paid", "preparing", "ready", "completed", "cancelled"],
  },
  createdTime: {
    type: String,
    default: ""
  },
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
  },
});

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
