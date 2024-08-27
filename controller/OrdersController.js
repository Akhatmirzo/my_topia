const Order = require("../model/OrderModel");
const Table = require("../model/TableModel");
const { getReceiverSocketId } = require("../socket/websocket");
const { totalPriceForProducts } = require("../utils/helper");

exports.CreateOrder = async (req, res) => {
  const currentDate = new Date();
  const gmtPlus5Date = new Date(currentDate.getTime() + 5 * 60 * 60 * 1000);
  const body = req.body;

  if (!body.products || body.products.length === 0) {
    return res.status(400).send({
      success: false,
      message: "products are required",
    });
  }

  try {
    const table = await Table.findOne({ table_number: body.table_number });

    if (!table) {
      return res.status(404).send({
        success: false,
        message: "Table not found",
      });
    }

    const total_price = totalPriceForProducts(body.products);

    const order = new Order({
      ...body,
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

    // Update table status
    await Table.findOneAndUpdate(
      { table_number: body.table_number },
      {
        $set: {
          empty: false,
          order: orderIds,
          updatedAt: gmtPlus5Date,
        },
      }
    );

    const receiverIds = getReceiverSocketId({ role: "employer" });

    if (receiverIds.length > 0) {
      receiverIds.forEach((receiverId) => {
        io.to(receiverId).emit("newOrder", { orderId: order._id });
      });
    }

    return res.status(201).send({
      success: true,
      message: "Order created successfully",
      order,
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

  const today = new Date();
  const gmtPlus5Date = new Date(today.getTime() + 5 * 60 * 60 * 1000);
  const todayStart = new Date(gmtPlus5Date.setHours(0, 0, 0, 0)); // Kunning boshini olish
  const todayEnd = new Date(gmtPlus5Date.setHours(23, 59, 59, 999));

  console.log(todayStart, todayEnd);

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

  if (!orders || orders.length === 0) {
    return res.status(400).send({
      success: false,
      message: "No orders found",
    });
  }

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

  if (order.status === "paid") {
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
  }

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

  return res.status(200).send({
    success: true,
    message: "Order was successfully deleted",
  });
};
