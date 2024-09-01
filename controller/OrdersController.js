const Order = require("../model/OrderModel");
const Table = require("../model/TableModel");
const { getReceiverSocketId, io } = require("../socket/websocket");
const { oneDayStartToEnd } = require("../utils/checkStatisticsDate");
const { totalPriceForProducts } = require("../utils/helper");

exports.CreateOrder = async (req, res) => {
  const currentDate = new Date();
  const gmtPlus5Date = new Date(currentDate.getTime() + 5 * 60 * 60 * 1000);
  const { products, table_number } = req.body;

  if (!products || products.length === 0) {
    return res.status(400).send({
      success: false,
      message: "products are required",
    });
  }

  if (!table_number) {
    return res.status(400).send({
      success: false,
      message: "Table number is required",
    });
  }

  try {
    const table = await Table.findOne({ table_number: table_number });

    if (!table) {
      return res.status(404).send({
        success: false,
        message: "Table not found",
      });
    }

    const { total_price, newProducts } = totalPriceForProducts(products);

    const order = new Order({
      products: newProducts,
      table_number,
      total_price,
      createdAt: gmtPlus5Date,
      updatedAt: gmtPlus5Date,
    });

    // Client Order save
    await order.save();

    let orderIds = [];
    if (table.order) {
      console.log(table.order);
      orderIds = [...table.order];
    }

    orderIds.push(order._id);

    let newOrder = await order.populate("products.product_id");

    // Update table status

    table.empty = false;
    table.order = orderIds;
    table.updatedAt = gmtPlus5Date;

    await table.save();

    const newTable = await table.populate({
      path: "order", // order maydonini populate qilamiz
      populate: {
        path: "products.product_id", // order ichidagi product_id ni populate qilamiz
        model: "Product", // Bu 'Product' modeliga murojaat
      },
    });

    const receiverIds = await getReceiverSocketId({ role: "employer" });
    const admin = await getReceiverSocketId({ role: "admin" });

    console.log("admin", admin);
    console.log("employer", receiverIds);

    if (admin) {
      io.to(admin).emit("newOrder", { newOrder });
      io.to(admin).emit("updateTable", newTable);
    }

    if (receiverIds) {
      for (const key in receiverIds) {
        io.to(receiverIds[key]).emit("newOrder", { newOrder });
        io.to(receiverIds[key]).emit("updateTable", newTable);
      }
    }

    return res.status(201).send({
      success: true,
      message: "Order created successfully",
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error creating order" + error.message,
    });
  }
};

exports.GetOrders = async (req, res) => {
  let handler = {};

  const { todayStart, todayEnd } = oneDayStartToEnd();

  if (req.role === "employer") {
    handler = {
      createdAt: {
        $gte: todayStart,
        $lte: todayEnd,
      },
    };
  }

  const orders = await Order.find(handler)
    .populate("products.product_id")
    .sort({
      createdAt: -1,
    });

  return res.status(200).send({
    success: true,
    orders,
  });
};

exports.GetOrder = async (req, res) => {
  const { id } = req.params;
  let handler = {};

  const order = await Order.findOne({
    _id: id,
    ...handler,
  });

  if (!order) {
    return res.status(400).send({
      success: false,
      message: "Order was not found",
    });
  }

  return res.status(200).send({
    success: true,
    order,
  });
};

exports.UpdateOrder = async (req, res) => {
  const currentDate = new Date();
  const gmtPlus5Date = new Date(currentDate.getTime() + 5 * 60 * 60 * 1000);
  const { id } = req.params;

  if (!id) {
    return res.status(400).send({
      success: false,
      message: "id is required",
    });
  }

  const order = await Order.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        status: req.body.status,
        updatedAt: gmtPlus5Date,
      },
    }
  );

  if (!order) {
    return res.status(400).send({
      success: false,
      message: "Order was not found",
    });
  }

  const updateOrder = await Order.findOne({ _id: id });

  const receiverIds = await getReceiverSocketId({ role: "employer" });
  const admin = await getReceiverSocketId({ role: "admin" });

  console.log("admin", admin);
  console.log("employer", receiverIds);

  if (admin) {
    io.to(admin).emit("updateOrder", { updateOrder });
  }

  if (receiverIds.length > 0) {
    for (const key in receiverIds) {
      io.to(receiverIds[key]).emit("updateOrder", { updateOrder });
    }
  }

  // if (order.status === "paid") {
  //   const table = await Table.findOne({ table_number: order.table_number });

  //   const editTableOrders = table.order.filter(
  //     (tableOrder) => tableOrder !== order._id
  //   );

  //   const updateTableObj = {
  //     empty: editTableOrders.length === 0,
  //     order: [...editTableOrders],
  //     updatedAt: gmtPlus5Date,
  //   };

  //   await Table.findOneAndUpdate(
  //     { table_number: order.table_number },
  //     {
  //       $set: updateTableObj,
  //     }
  //   );
  // }

  return order.status(200).send({
    success: true,
    message: "Order was successfully updated",
  });
};

exports.DeleteOrder = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).send({
      success: false,
      message: "id is required",
    });
  }

  const order = await Order.findOneAndDelete({
    _id: id,
  });

  if (!order) {
    return res.status(404).send({
      success: false,
      message: "Order was not found",
    });
  }

  const table = await Table.findOne({ table_number: order.table_number });

  const editTableOrders = table.order.filter(
    (tableOrder) => tableOrder !== order._id
  );

  const updateTableObj = {
    empty: editTableOrders.length === 0,
    order: [...editTableOrders],
    updatedAt: gmtPlus5Date,
  };

  await Table.findOneAndUpdate(
    { table_number: order.table_number },
    {
      $set: updateTableObj,
    }
  );

  return res.status(200).send({
    success: true,
    message: "Order was successfully deleted",
  });
};
