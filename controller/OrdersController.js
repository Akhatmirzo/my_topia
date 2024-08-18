const Order = require("../model/OrderModel");
const Products = require("../model/ProductsModel");
const { totalPriceForProducts } = require("../utils/helper");

exports.CreateOrder = async (req, res) => {
  const body = req.body;

  if (!body.products || body.products.length === 0) {
    return res.status(400).send({
      success: false,
      message: "products are required",
    });
  }

  const total_price = totalPriceForProducts(body.products);

  const order = new Order({
    ...body,
    total_price,
  });

  // Client Order save
  await order.save();

  return res.status(201).send({
    success: true,
    message: "Order created successfully",
    order,
  });
};

exports.GetOrders = async (req, res) => {
  let handler = {};
  
  // const today = new Date();
  // const todayStart = new Date(today.setHours(0, 0, 0, 0)); // Kunning boshini olish
  // const todayEnd = new Date(today.setHours(23, 59, 59, 999));

  console.log(todayStart, todayEnd);

  if (req.role === "admin") {
    handler = {
      // created_at: {
      //   $gte: todayStart,
      //   $lte: todayEnd,
      // },
    };
  }

  const orders = await Order.find(handler).populate("products.product_id").sort({
    created_at: -1,
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
  const { id } = req.params;

  const { products } = req.body;

  if (!products || !id) {
    return res.status(400).send({
      success: false,
      message: "products and id is required",
    });
  }

  const order = await Order.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        products,
      },
    }
  );

  if (!order) {
    return res.status(400).send({
      success: false,
      message: "Order was not found",
    });
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
    client_id: req.userId,
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
