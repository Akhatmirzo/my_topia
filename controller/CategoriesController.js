const Categories = require("../model/CategoriesModel");
const fs = require("fs");
const Products = require("../model/ProductsModel");

exports.categoriesCreate = async (req, res) => {
  const currentDate = new Date();
  const gmtPlus5Date = new Date(currentDate.getTime() + 5 * 60 * 60 * 1000);
  const { name } = { ...req.body };
  const image = req.files;

  if (!name) {
    return res.status(400).send({
      success: false,
      error: "Category Name is required",
    });
  }

  if (image.length === 0)
    return res.status(404).send({
      success: false,
      message: "Images are required",
    });

  const category = new Categories({
    name,
    image: image[0],
    createdAt: gmtPlus5Date,
    updatedAt: gmtPlus5Date,
  });

  await category.save();

  return res.status(201).send({
    success: true,
    message: "Category was successfully created",
  });
};

exports.categories = async (req, res) => {
  const categories = await Categories.find();

  if (!categories || categories.length === 0) {
    return res.status(404).send({
      success: false,
      error: "No categories found",
    });
  }

  return res.status(200).send({
    success: true,
    categories,
  });
};

exports.category = async (req, res) => {
  const { id } = req.params;

  const category = await Categories.findOne({ _id: id });

  if (!category) {
    return res.status(404).send({
      success: false,
      message: "Category was not found",
    });
  }

  return res.status(200).send({
    success: true,
    category,
  });
};

exports.categoryUpdate = async (req, res) => {
  const currentDate = new Date();
  const gmtPlus5Date = new Date(currentDate.getTime() + 5 * 60 * 60 * 1000);
  const { id } = req.params;
  const { name } = { ...req.body };
  const image = req.files;

  if (!name || !id) {
    return res.status(400).send({
      success: false,
      message: "Name and id is required",
    });
  }

  const optionsUpdate = {
    name,
    updatedAt: gmtPlus5Date,
  };

  if (image.length > 0) {
    optionsUpdate.image = image[0];

    const OldCategory = await Categories.findOne({ _id: id });

    const oldImages = OldCategory.image;

    fs.unlink(oldImages.path, (err) => {
      if (err) console.log(err);
    });
  }

  const category = await Categories.findByIdAndUpdate(
    { _id: id },
    {
      $set: optionsUpdate,
    }
  );

  if (!category) {
    return res.status(404).send({
      success: false,
      message: "Category was not found",
    });
  }

  return res.status(200).send({
    success: true,
    message: "Category was successfully updated",
  });
};

exports.categoryDelete = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).send({
      success: false,
      message: "id is required",
    });
  }

  const category = await Categories.findByIdAndDelete({ _id: id });

  if (!category) {
    return res.status(404).send({
      success: false,
      message: "Category was not found",
    });
  }

  await Products.updateMany(
    { category_id: category._id },
    {
      $set: {
        deleted: true,
      },
    }
  );

  const oldImages = category.image;

  fs.unlink(oldImages.path, (err) => {
    if (err) console.log(err);
  });

  return res.status(200).send({
    success: true,
    message: "Category was successfully deleted",
  });
};
