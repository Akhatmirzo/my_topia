const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
  },
  options: {
    type: Array,
    // items: {
    //   type: Object,
    //   properties: {
    //     name: { type: String },
    //     price: { type: Number },
    //   },
    // },
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
    default: [],
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
