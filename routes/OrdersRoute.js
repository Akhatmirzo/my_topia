const {
  CreateOrder,
  GetOrder,
  DeleteOrder,
  CheckingOrders,
  OrdersPaginations,
} = require("../controller/OrdersController");
const auth = require("../middlewares/auth");
const { errorHandler } = require("../utils/errorHandler");

function OrdersRoute(fastify, options, done) {
  fastify.post("/create", {
    schema: {
      tags: ["Order"],
      body: {
        type: "object",
        properties: {
          products: {
            type: "array",
            items: {
              type: "object",
              properties: {
                product_id: { type: "string" },
                quantity: { type: "number" },
              },
            },
          },
        },
      },
    },
    handler: errorHandler(CreateOrder),
  });

  fastify.get("/all", {
    preHandler: [auth(["admin", "employer"])],
    schema: {
      tags: ["Order"],
      headers: {
        authorization: {
          type: "string",
          description: "Admin Token",
        },
      },
      query: {
        page: { type: "number", default: 1 },
        pageSize: { type: "number", default: 10 },
      },
    },
    handler: errorHandler(OrdersPaginations),
  });

  fastify.get("/one/:id", {
    preHandler: [auth(["admin", "employer"])],
    schema: {
      tags: ["Order"],
      headers: {
        authorization: {
          type: "string",
          description: "Admin Token",
        },
      },
    },
    handler: errorHandler(GetOrder),
  });

  fastify.post("/check/orders", {
    schema: {
      tags: ["Order"],
      body: {
        type: "object",
        properties: {
          ids: {
            type: "array",
          },
        },
      },
    },
    handler: errorHandler(CheckingOrders),
  });

  fastify.delete("/delete/:id", {
    preHandler: [auth(["admin"])],
    schema: {
      tags: ["Order"],
      headers: {
        authorization: {
          type: "string",
          description: "Admin Token",
        },
      },
    },
    handler: errorHandler(DeleteOrder),
  });

  done();
}

module.exports = OrdersRoute;
