const mongoose = require("mongoose");
const TableSchema = mongoose.Schema({
  table_number: {
    type: Number,
    required: true,
    unique: true,
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    default: null,
  },
  empty: {
    type: Boolean,
    default: true,
  },
});

const Table = mongoose.model("Table", TableSchema);

module.exports = Table;
