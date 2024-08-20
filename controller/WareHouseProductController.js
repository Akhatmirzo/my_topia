const WareHouseProduct = require("../model/WareHouseProductsModel");
const moment = require("moment-timezone");

exports.create = async (req, res) => {
  const localTime = moment().tz("Asia/Tashkent").format();
  const { name, qty, unit } = req.body;

  if (!name || !qty || !unit) {
    return res.status(400).send({
      success: false,
      message: "Name, quantity, and unit are required",
    });
  }

  const Product = new WareHouseProduct({
    name,
    qty,
    unit,
    createdAt: new Date(localTime),
    updatedAt: new Date(localTime),
  });

  await Product.save();

  res.status(200).send({
    success: true,
    message: "Product created successfully",
  });
};

exports.getAll = async (req, res) => {
  const products = await WareHouseProduct.find().sort({ qty: -1 });

  if (!products || products.length === 0) {
    return res.status(404).send({
      success: false,
      message: "No products found",
    });
  }

  res.status(200).send({
    success: true,
    message: "Products retrieved successfully",
    products,
  });
};

exports.getProduct = async (req, res) => {
  const { id } = req.params;
  const product = await WareHouseProduct.findById(id);

  if (!product) {
    return res.status(404).send({
      success: false,
      message: "Product not found",
    });
  }

  res.status(200).send({
    success: true,
    message: "Product retrieved successfully",
    product,
  });
};

exports.updateProduct = async (req, res) => {
  const localTime = moment().tz("Asia/Tashkent").format();
  const { id } = req.params;

  const updatedProduct = await WareHouseProduct.findByIdAndUpdate(id, {
    $set: {
      ...req.body,
      updatedAt: new Date(localTime),
    },
  });

  if (!updatedProduct) {
    return res.status(404).send({
      success: false,
      message: "Product not found",
    });
  }

  res.status(200).send({
    success: true,
    message: "Product updated successfully",
  });
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  const deletedProduct = await WareHouseProduct.findByIdAndDelete(id);

  if (!deletedProduct) {
    return res.status(404).send({
      success: false,
      message: "Product not found",
    });
  }

  res.status(200).send({
    success: true,
    message: "Product deleted successfully",
  });
};
