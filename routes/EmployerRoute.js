const {
  employerRegister,
  employerLogin,
  employerGetAll,
  employerGetOne,
  employerUpdate,
  employerDelete,
} = require("../controller/EmployerController");
const auth = require("../middlewares/auth");
const { errorHandler } = require("../utils/errorHandler");

function EmployerRoute(fastify, options, done) {
  fastify.post("/register", {
    preHandler: [auth(["admin"])],
    schema: {
      tags: ["Employer"],
      body: {
        type: "object",
        properties: {
          phoneNumber: { type: "string", default: "+998-90-456-15-26" },
          fullname: {
            type: "string",
            default: "testemp",
          },
          password: { type: "string" },
        },
      },

      headers: {
        authorization: {
          type: "string",
          description: "Administrator Token",
        },
      },
    },
    handler: errorHandler(employerRegister),
  });

  fastify.post("/login", {
    schema: {
      tags: ["Employer"],
      body: {
        type: "object",
        properties: {
          phoneNumber: { type: "string", default: "+998904561526" },
          password: { type: "string" },
        },
      },
    },
    handler: errorHandler(employerLogin),
  });

  fastify.get("/all", {
    preHandler: [auth(["admin"])],
    schema: {
      tags: ["Employer"],
      headers: {
        authorization: {
          type: "string",
          description: "Administrator Token",
        },
      },
    },
    handler: errorHandler(employerGetAll),
  });

  fastify.get("/one/:id", {
    preHandler: [auth(["admin", "employer"])],
    schema: {
      tags: ["Employer"],

      params: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description:
              "Employer ID. !!! If you pass the string 'me' from params. You will receive the data of the Employer who is logged in to the system.",
          },
        },
      },

      headers: {
        authorization: {
          type: "string",
          description: "Administrator Token",
        },
      },
    },
    handler: errorHandler(employerGetOne),
  });

  fastify.put("/update/:id", {
    preHandler: [auth(["admin"])],
    schema: {
      tags: ["Employer"],

      headers: {
        authorization: {
          type: "string",
          description: "Administrator Token",
        },
      },
    },
    handler: errorHandler(employerUpdate),
  });

  fastify.delete("/delete/:id", {
    preHandler: [auth(["admin"])],
    schema: {
      tags: ["Employer"],
      headers: {
        authorization: {
          type: "string",
          description: "Administrator Token",
        },
      },
    },
    handler: errorHandler(employerDelete),
  });

  done();
}

module.exports = EmployerRoute;
