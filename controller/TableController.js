const Table = require("../model/TableModel");
const moment = require('moment-timezone');

const localTime = moment().tz("Asia/Tashkent").format();

exports.create = async (req, res) => {
  const { table_number } = req.body;

  if (!table_number) {
    return res.status(400).send({
      success: false,
      message: "Table number is required",
    });
  }

  const table = await Table({
    table_number,
    createdAt: new Date(localTime),
    updatedAt: new Date(localTime),
  });

  await table.save();

  return res.send({
    success: true,
    message: "Table created successfully",
    table,
  });
};

exports.getTables = async (req, res) => {
  const tables = await Table.find();

  if (!tables || tables.length === 0) {
    return res.status(404).send({
      success: false,
      message: "No tables found",
    });
  }

  return res.send({
    success: true,
    tables,
  });
};

exports.getTableById = async (req, res) => {
  const { id } = req.params;

  const table = await Table.findById(id);

  if (!table) {
    return res.status(404).send({
      success: false,
      message: "Table not found",
    });
  }

  return res.send({
    success: true,
    table,
  });
};

exports.deleteTable = async (req, res) => {
  const { id } = req.params;

  const table = await Table.findByIdAndDelete({ _id: id });

  if (!table) {
    return res.status(404).send({
      success: false,
      message: "Table not found",
    });
  }

  return res.send({
    success: true,
    message: "Table deleted successfully",
  });
};

exports.updateTable = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).send({
      success: false,
      message: "Table ID is required",
    });
  }

  const table = await Table.findOneAndUpdate(
    {
      _id: id,
    },
    {
      $set: {
        ...req.body,
        updatedAt: new Date(localTime),
      },
    }
  );

  if (!table) {
    return res.status(404).send({
      success: false,
      message: "Table not found",
    });
  }

  return res.send({
    success: true,
    message: "Table updated successfully",
    table,
  });
};
