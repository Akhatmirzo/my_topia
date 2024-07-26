const { CreateOrder, GetOrders, GetOrder, UpdateOrder, DeleteOrder } = require("../controller/OrdersController");
const auth = require("../middlewares/auth");
const { errorHandler } = require("../utils/errorHandler");


function OrdersRoute(fastify, options, done) {
  fastify.post("/create", {
    preHandler: [auth(["client"])],
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
    handler: errorHandler(GetOrders),
  })

  fastify.get("/one/:id", {
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
    handler: errorHandler(GetOrder),
  })

  fastify.put("/update/:id", {
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
    handler: errorHandler(UpdateOrder),
  })

  fastify.delete("/delete/:id", {
    preHandler: [auth(["Admin"])],
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
  })

  done()
}

module.exports = OrdersRoute;
