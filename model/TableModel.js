const mongoose = require("mongoose");
const TableSchema = mongoose.Schema({
  table_number: {
    type: Number,
    required: true,
    unique: true,
  },
  empty: {
    type: Boolean,
    default: true,
  },
});

const Table = mongoose.model("Table", TableSchema);

module.exports = Table;