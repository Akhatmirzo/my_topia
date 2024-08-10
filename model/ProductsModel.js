const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  images: {
    type: Array,
    required: true,
  },
  category_id: {
    type: String,
    required: true,
  },
  characteristics: {
    type: Array,
    // required: true,
  },
  addition: {
    type: Array,
    default: [],
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Products = mongoose.model("Product", ProductSchema);

module.exports = Products;
