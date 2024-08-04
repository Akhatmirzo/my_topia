const mongoose = require("mongoose");

const WareHouseProductsSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  qty: {
    type: Number,
    required: true,
    default: 0,
  },
  unit: {
    type: String,
    enum: ["kg", "dona", "qadoq", "litr"],
    required: true,
  },
});

const WareHouseProduct = mongoose.model(
  "WareHouseProduct",
  WareHouseProductsSchema
);

module.exports = WareHouseProduct;
