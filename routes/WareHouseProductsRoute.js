const {
  create,
  getAll,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../controller/WareHouseProductController");
const auth = require("../middlewares/auth");
const { errorHandler } = require("../utils/errorHandler");

function WareHouseProductsRoute(fastify, options, done) {
  fastify.post("/create", {
    preHandler: [auth(["admin"])],
    schema: {
      tags: ["WareHouseProduct"],
      body: {
        type: "object",
        properties: {
          name: { type: "string" },
          qty: { type: "number" },
          unit: {
            type: "string",
            enum: ["kg", "liter", "dona", "qadoq"],
          },
          //... other properties
        },
      },

      headers: {
        authorization: {
          type: "string",
          description: "Administrator Token",
        },
      },
    },
    handler: errorHandler(create),
  });

  fastify.get("/all", {
    preHandler: [auth(["admin"])],
    schema: {
      tags: ["WareHouseProduct"],
      headers: {
        authorization: {
          type: "string",
          description: "Administrator Token",
        },
      },
    },
    handler: errorHandler(getAll),
  });

  fastify.get("/one/:id", {
    preHandler: [auth(["admin"])],
    schema: {
      tags: ["WareHouseProduct"],
      params: {
        type: "object",
        properties: {
          id: { type: "string" },
        },
      },
      headers: {
        authorization: {
          type: "string",
          description: "Administrator Token",
        },
      },
    },
    handler: errorHandler(getProduct),
  });

  fastify.put("/update/:id", {
    preHandler: [auth(["admin"])],
    schema: {
      tags: ["WareHouseProduct"],
      params: {
        type: "object",
        properties: {
          id: { type: "string" },
        },
      },
      body: {
        type: "object",
        properties: {
          name: { type: "string" },
          qty: { type: "number" },
          unit: {
            type: "string",
            enum: ["kg", "liter", "dona", "qadoq"],
          },
          //... other properties
        },
      },
      headers: {
        authorization: {
          type: "string",
          description: "Administrator Token",
        },
      },
    },
    handler: errorHandler(updateProduct),
  });

  fastify.delete("/delete/:id", {
    preHandler: [auth(["admin"])],
    schema: {
      tags: ["WareHouseProduct"],
      params: {
        type: "object",
        properties: {
          id: { type: "string" },
        },
      },
      headers: {
        authorization: {
          type: "string",
          description: "Administrator Token",
        },
      },
    },
    handler: errorHandler(deleteProduct),
  });

  done();
}

module.exports = WareHouseProductsRoute;