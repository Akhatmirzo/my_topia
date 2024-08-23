const mongoose = require("mongoose");
const TableSchema = mongoose.Schema({
  table_number: {
    type: Number,
    required: true,
    unique: true,
  },
  order: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
  empty: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
  },
});

const Table = mongoose.model("Table", TableSchema);

module.exports = Table;
