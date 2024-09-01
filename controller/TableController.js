const Order = require("../model/OrderModel");
const Table = require("../model/TableModel");
const { io, getReceiverSocketId } = require("../socket/websocket");

exports.create = async (req, res) => {
  const currentDate = new Date();
  const gmtPlus5Date = new Date(currentDate.getTime() + 5 * 60 * 60 * 1000);
  const { table_number } = req.body;

  if (!table_number) {
    return res.status(400).send({
      success: false,
      message: "Table number is required",
    });
  }

  const table = await Table({
    table_number,
    createdAt: gmtPlus5Date,
    updatedAt: gmtPlus5Date,
  });

  await table.save();

  return res.send({
    success: true,
    message: "Table created successfully",
    table,
  });
};

exports.getTables = async (req, res) => {
  const tables = await Table.find().populate({
    path: "order", // order maydonini populate qilamiz
    populate: {
      path: "products.product_id", // order ichidagi product_id ni populate qilamiz
      model: "Product", // Bu 'Product' modeliga murojaat
    },
  });

  return res.send({
    success: true,
    tables,
  });
};

exports.getTableById = async (req, res) => {
  const { id } = req.params;

  const table = await Table.findById(id).populate("order");

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
  const currentDate = new Date();
  const gmtPlus5Date = new Date(currentDate.getTime() + 5 * 60 * 60 * 1000);
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
        updatedAt: gmtPlus5Date,
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

exports.changeTableOrder = async (req, res) => {
  const currentDate = new Date();
  const gmtPlus5Date = new Date(currentDate.getTime() + 5 * 60 * 60 * 1000);
  const { table_id } = req.params;

  if (!table_id) {
    return res.status(400).send({
      success: false,
      message: "Table ID is required",
    });
  }

  const table = await Table.findOne({ _id: table_id });

  if (!table) {
    return res.status(404).send({
      success: false,
      message: "Table not found",
    });
  }

  const tableOrders = table.order;

  const filter = { _id: { $in: tableOrders } };

  await Order.updateMany(filter, {
    $set: {
      status: req.body.status,
      updatedAt: gmtPlus5Date,
    },
  });

  table.empty = true;
  table.order = [];
  table.updatedAt = gmtPlus5Date;

  await table.save();

  const receiverIds = await getReceiverSocketId({ role: "employer" });
  const admin = await getReceiverSocketId({ role: "admin" });

  if (admin) {
    io.to(admin).emit("updateTable", table);
    io.to(admin).emit("reflesh", "reflesh");
  }

  if (receiverIds) {
    console.log(receiverIds);
    
    for (const key in receiverIds) {
      io.to(receiverIds[key]).emit("updateTable", table);
      io.to(receiverIds[key]).emit("reflesh", "reflesh");
    }
  }

  return res.send({
    success: true,
    message: "Table order changed successfully",
    table,
  });
};
