const Order = require("../model/OrderModel");
const Products = require("../model/ProductsModel");
const { totalPriceForProducts } = require("../utils/helper");

exports.CreateOrder = async (req, res) => {
  const { products } = req.body;

  if (!products || products.length === 0) {
    return res.status(400).send({
      success: false,
      message: "products are required",
    });
  }

  const orderProducts = await Promise.all(
    products.map(async (product) => {
      const productData = await Products.findById(product.product_id);
      if (!productData) {
        throw new Error(`Product with id ${product.product_id} not found`);
      }

      const new_product = {
        product: productData,
        quantity: product.quantity,
        price: Number(productData.price * product.quantity),
      };

      return new_product;
    })
  );

  if (!orderProducts) {
    return res.status(400).send({
      success: false,
      message: "products are required",
    });
  }

  const total_price = totalPriceForProducts(orderProducts);

  const order = new Order({
    total_price,
    client_id: req.userId,
    products: orderProducts,
  });

  // Client Order save
  await order.save();

  return res.status(201).send({
    success: true,
    message: "Order created successfully",
    data: order,
  });
};

exports.GetOrders = async (req, res) => {
  let handler = {};

  if (req.role === "client") {
    handler = { client_id: req.userId };
  }

  const orders = await Order.find(handler);

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

  if (req.role === "client") {
    handler = { client_id: req.userId };
  }

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
    { _id: id, client_id: req.userId },
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
