const Categories = require("../model/CategoriesModel");
const fs = require("fs");

exports.categoriesCreate = async (req, res) => {
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
    category,
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

  const oldImages = category.image;

  fs.unlink(oldImages.path, (err) => {
    if (err) console.log(err);
  });

  return res.status(200).send({
    success: true,
    message: "Category was successfully deleted",
  });
};
