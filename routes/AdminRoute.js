const { registerAdmin, loginAdmin } = require("../controller/AdminController");
const { errorHandler } = require("../utils/errorHandler");

function AdminRoute(fastify, options, done) {
  fastify.post("/register", {
    schema: {
      tags: ["Admin"],
      body: {
        type: "object",
        properties: {
          phoneNumber: { type: "string", default: "+998904561223" },
          password: { type: "string" },
        },
      },
    },
    handler: errorHandler(registerAdmin),
  });

  fastify.post("/login", {
    schema: {
      tags: ["Admin"],
      body: {
        type: "object",
        properties: {
          phoneNumber: { type: "string", default: "+998904561223" },
          password: { type: "string" },
        },
      },
    },
    handler: errorHandler(loginAdmin),
  });

  done();
}

module.exports = AdminRoute;
