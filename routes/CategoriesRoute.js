const fastifyMultipart = require("@fastify/multipart");
const {
  categoriesCreate,
  categories,
  category,
  categoryUpdate,
  categoryDelete,
} = require("../controller/CategoriesController");
const auth = require("../middlewares/auth");
const { errorHandler } = require("../utils/errorHandler");
const { fieldsUpload } = require("../utils/multer");

function CategoriesRoute(fastify, options, done) {
  fastify.post("/create", {
    preHandler: [auth(["admin"]), fieldsUpload(1)],
    schema: {
      tags: ["Category"],

      headers: {
        authorization: {
          type: "string",
          description: "Administrator Token",
        },
      },

      response: {
        201: {
          description: "Successfully Response",
          type: "object",
          properties: {
            success: { type: "string", default: "true" },
            message: {
              type: "string",
              default: "Category was successfully created",
            },
          },
        },

        400: {
          description: "Data required",
          type: "object",
          properties: {
            success: { type: "string", default: "false" },
            message: { type: "string", default: "Name or image is required" },
          },
        },

        500: {
          description: "Internal Server Error",
          type: "object",
          properties: {
            success: { type: "string", default: "false" },
            message: { type: "string", default: "Server error" },
          },
        },
      },
    },
    handler: errorHandler(categoriesCreate),
  });

  fastify.get("/all", {
    schema: {
      tags: ["Category"],
      response: {
        200: {
          type: "object",
          description: "Get all categories",
          properties: {
            success: { type: "string", default: "true" },
            categories: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  _id: { type: "string" },
                  name: { type: "string" },
                  image: { type: "object", properties: {
                    filename: { type: "string" },
                    originalname: { type: "string" },
                    encoding: {type: 'string'},
                    mimetype: { type: "string" },
                    destination: { type: "string" },
                    filename: { type: "string" },
                    path: { type: "string" },
                    size: { type: "number" },
                  } },
                },
              },
            },
          },
        },

        404: {
          type: "object",
          properties: {
            success: { type: "string", default: "false" },
            message: { type: "string", default: "No categories found" },
          },
        },

        500: {
          type: "object",
          properties: {
            success: { type: "string", default: "false" },
            message: { type: "string", default: "Server error" },
          },
        },
      },
    },
    handler: errorHandler(categories),
  });

  fastify.get("/one/:id", {
    schema: {
      tags: ["Category"],
    },
    handler: errorHandler(category),
  });

  fastify.put("/update/:id", {
    preHandler: [auth(["admin"]), fieldsUpload(1)],
    schema: {
      tags: ["Category"],
      
      headers: {
        authorization: {
          type: "string",
          description: "Administrator Token",
        },
      },
    },
    handler: errorHandler(categoryUpdate),
  });

  fastify.delete("/delete/:id", {
    preHandler: [auth(["admin"])],
    schema: {
      tags: ["Category"],
      headers: {
        authorization: {
          type: "string",
          description: "Administrator Token",
        },
      },
    },
    handler: errorHandler(categoryDelete),
  });

  done();
}

module.exports = CategoriesRoute;
