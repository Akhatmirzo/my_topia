const {
  create,
  getTables,
  getTableById,
  updateTable,
  deleteTable,
} = require("../controller/TableController");
const auth = require("../middlewares/auth");
const { errorHandler } = require("../utils/errorHandler");

function TableRoute(fastify, options, done) {
  fastify.post("/create", {
    preHandler: [auth(["admin"])],
    schema: {
      tags: ["Table"],
      body: {
        type: "object",
        properties: {
          table_number: { type: "string" },
          empty: { type: "boolean", default: true },
          // ... other properties
        },
      },
    },
    handler: errorHandler(create),
  });

  fastify.get("/all", {
    preHandler: [auth(["admin", "employer"])],
    schema: {
      tags: ["Table"],
    },
    handler: errorHandler(getTables),
  });

  fastify.get("/one/:id", {
    preHandler: [auth(["admin", "employer"])],
    schema: {
      tags: ["Table"],
    },
    handler: errorHandler(getTableById),
  });

  fastify.put("/update/:id", {
    preHandler: [auth(["admin", "employer"])],
    schema: {
      tags: ["Table"],
      body: {
        type: "object",
        properties: {
          //... properties to update
          empty: { type: "boolean" },
        },
      },
    },
    handler: errorHandler(updateTable),
  });
  
  fastify.delete("/delete/:id", {
    preHandler: [auth(["admin"])],
    schema: {
      tags: ["Table"],
    },
    handler: errorHandler(deleteTable),
  });
  done();
}

module.exports = TableRoute;
