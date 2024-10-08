const Products = require("../model/ProductsModel");
const fs = require("fs");

exports.CreateProduct = async (req, res) => {
  const currentDate = new Date();
  const gmtPlus5Date = new Date(currentDate.getTime() + 5 * 60 * 60 * 1000);
  const { name, category_id } = {
    ...req.body,
  };

  const images = req.files;

  if (!name || !category_id) {
    return res.status(400).send({
      success: false,
      message: "Data are required",
    });
  }

  if (images.length === 0)
    return res.status(404).send({
      success: false,
      message: "Images are required",
    });

  const productObj = {
    ...req.body,
    images,
    createdAt: gmtPlus5Date,
    updatedAt: gmtPlus5Date,
  };

  const newProduct = new Products(productObj);

  await newProduct.save();

  return res.status(201).send({
    success: true,
    message: "Product created successfully",
    data: newProduct,
  });
};

exports.GetProducts = async (req, res) => {
  const { category_id } = req.query;

  let products = null;

  let findingProduct = {};

  if (category_id) {
    findingProduct = {
      ...findingProduct,
      category_id: category_id,
      deleted: false,
    };
  }

  if (req.role === "admin") {
    products = await Products.find(findingProduct).sort({
      createdAt: -1,
    });
  } else {
    products = await Products.find({
      ...findingProduct,
      deleted: false,
    }).sort({
      createdAt: -1,
    });
  }

  if (!products || products.length === 0) {
    return res.status(404).send({
      success: false,
      message: "No products found",
    });
  }

  return res.status(200).send({
    success: true,
    products,
  });
};

exports.GetProduct = async (req, res) => {
  const { id } = req.params;

  let product = await Products.findOne({ _id: id });

  if (!product) {
    return res.status(404).send({
      success: false,
      message: "Product was not found",
    });
  }

  return res.status(200).send({
    success: true,
    product,
  });
};

exports.UpdateProduct = async (req, res) => {
  const currentDate = new Date();
  const gmtPlus5Date = new Date(currentDate.getTime() + 5 * 60 * 60 * 1000);
  const { id } = req.params;

  const newImages = req.files;

  const updateProduct = {
    ...req.body,
    updatedAt: gmtPlus5Date,
  };

  if (newImages.length > 0) {
    updateProduct.images = newImages;
  }

  const product = await Products.findOneAndUpdate(
    { _id: id },
    { $set: updateProduct }
  );

  if (!product) {
    return res.status(400).send({
      success: false,
      message: "Product was not found",
    });
  }

  if (newImages.length > 0) {
    const oldImages = product.images;

    for (let i = 0; i < oldImages.length; i++) {
      fs.unlink(oldImages[i].path, (err) => {
        if (err) console.log(err);
      });
    }
  }

  return res.status(200).send({
    success: true,
    message: "Product was successfully updated",
  });
};

exports.DeleteSwapProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Products.findOneAndUpdate(
    { _id: id },
    { $set: { deleted: true } }
  );

  if (!product) {
    return res.status(404).send({
      success: false,
      message: "Product was not found",
    });
  }

  return res.status(200).send({
    success: true,
    message: "Product was successfully deleted",
  });
};

exports.DeleteProduct = async (req, res) => {
  const { id } = req.params;

  const product = await Products.findOneAndDelete({
    _id: id,
  });

  if (!product) {
    return res.status(404).send({
      success: false,
      message: "Product was not found",
    });
  }

  const oldImages = product.images;

  for (let i = 0; i < oldImages.length; i++) {
    fs.unlink(oldImages[i].path, (err) => {
      if (err) console.log(err);
    });
  }

  return res.status(200).send({
    success: true,
    message: "Product was successfully deleted",
  });
};

// Products Pagination
exports.GetProductsWebPage = async (req, res) => {
  const { category = "" } = req.query;

  let findingProduct = {
    deleted: false,
  };

  if (category) {
    findingProduct = {
      ...findingProduct,
      category_id: category,
    };
  }

  const products = await Products.find(findingProduct).sort({
    createdAt: -1,
  });

  if (!products || products.length === 0) {
    return res.status(404).send({
      success: false,
      message: "No products found",
    });
  }

  return res.status(200).send({
    success: true,
    products,
  });
};

exports.GetProductWebPage = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).send({
      success: false,
      message: "id is required",
    });
  }

  let product = await Products.findOne({ _id: id, deleted: false });

  if (!product) {
    return res.status(404).send({
      success: false,
      message: "Product was not found",
    });
  }

  return res.status(200).send({
    success: true,
    product,
  });
};
