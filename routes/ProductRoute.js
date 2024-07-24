const { errorHandler } = require("../utils/errorHandler");
const auth = require("../middlewares/auth");
const {
  CreateProduct,
  GetProducts,
  GetProduct,
  UpdateProduct,
  DeleteProduct,
  DeleteSwapProduct,
} = require("../controller/ProductController");
const { fieldsUpload } = require("../utils/multer");

function ProductRoute(fastify, options, done) {
  // Create product
  fastify.post("/create", {
    preHandler: [auth(["admin"]), fieldsUpload(3)],
    schema: {
      tags: ["Product"],
      // body: {
      //   type: "object",
      //   properties: {
      //     name: { type: "string", default: "product" },
      //     price: { type: "number", default: 0 },
      //     description: { type: "string", default: "description" },
      //     category_id: { type: "string" },
      //     images: { type: "array", default: [] },
      //     characteristics: {
      //       type: "array",
      //       default: [],
      //     }
      //   },
      // },

      headers: {
        authorization: {
          type: "string",
          description: "Administrator Token",
        },
      },
    },
    handler: errorHandler(CreateProduct),
  });

  fastify.get("/pagination", {
    preHandler: [auth(["admin"])],
    schema: {
      tags: ["Product"],
      headers: {
        authorization: {
          type: "string",
          description: "Administrator Token",
        },
      },
      query: {
        type: "object",
        properties: {
          page: {
            type: "number",
            default: 1,
          },
          pageSize: {
            type: "number",
            default: 10,
          },
          category: {
            type: "string",
            default: "",
          }
        },
      },
    },
    handler: errorHandler(GetProducts),
  });

  fastify.get("/one/:id", {
    preHandler: [auth(["admin"])],
    schema: {
      tags: ["Product"],
    },
    handler: errorHandler(GetProduct),
  });

  fastify.put("/update/:id", {
    preHandler: [auth(["admin"]), fieldsUpload(3)],
    schema: {
      tags: ["Product"],
    },
    handler: errorHandler(UpdateProduct),
  });

  fastify.delete("/delete/:id", {
    preHandler: [auth(["admin"])],
    schema: {
      tags: ["Product"],
    },
    handler: errorHandler(DeleteProduct),
  });

  fastify.put("/deleted/:id", {
    preHandler: [auth(["admin",])],
    schema: {
      tags: ["Product"],
    },
    handler: errorHandler(DeleteSwapProduct),
  })

  done();
}

module.exports = ProductRoute;
