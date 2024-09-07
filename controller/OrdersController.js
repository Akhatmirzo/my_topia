const Order = require("../model/OrderModel");
const Table = require("../model/TableModel");
const { getReceiverSocketId, io } = require("../socket/websocket");
const {
  oneDayStartToEnd,
  getGmt5Plus,
} = require("../utils/checkStatisticsDate");
const { generatePDFBuffer } = require("../utils/generatePDFBuffer");
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
    const timing = gmtPlus5Date.toDateString();
    console.log(timing);
    

    const order = new Order({
      products: newProducts,
      table_number,
      total_price,
      createdTime: toString(gmtPlus5Date),
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

    const today = new Date(newOrder.createdAt);

    const formattedDate = `${today.getDate()}-${
      today.getMonth() + 1
    }-${today.getFullYear()}T${today.getHours()}-${today.getMinutes()}-${today.getSeconds()}`;

    console.log(formattedDate);

    const fileName = `${formattedDate}-----${newOrder._id}.pdf`;
    const pdfBuffer = await generatePDFBuffer(newOrder);

    console.log(fileName, pdfBuffer);

    io.emit("print", { fileName, fileContent: pdfBuffer });

    return res.status(201).send({
      success: true,
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error creating order" + error.message,
    });
  }
};

exports.OrdersPaginations = async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const skip = (page - 1) * pageSize;

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
    .skip(skip)
    .limit(parseInt(pageSize))
    .populate("products.product_id")
    .sort({ createdAt: -1 });

  const orderLength = await Order.countDocuments(handler);

  res.send({
    success: true,
    orders: orders,
    totalPages: Math.ceil(orderLength / pageSize),
    currentPage: page,
  });
};

exports.CheckingOrders = async (req, res) => {
  const { ids } = req.body;

  if (!ids || ids.length === 0) {
    return res.status(400).send({
      success: false,
      message: "ids are required",
    });
  }

  const orders = await Order.find({
    _id: { $in: ids },
  })
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

  // const table = await Table.findOne({ table_number: order.table_number });

  // const editTableOrders = table.order.filter(
  //   (tableOrder) => tableOrder !== order._id
  // );

  // const updateTableObj = {
  //   empty: editTableOrders.length === 0,
  //   order: [...editTableOrders],
  //   updatedAt: gmtPlus5Date,
  // };

  // await Table.findOneAndUpdate(
  //   { table_number: order.table_number },
  //   {
  //     $set: updateTableObj,
  //   }
  // );

  return res.status(200).send({
    success: true,
    message: "Order was successfully deleted",
  });
};
