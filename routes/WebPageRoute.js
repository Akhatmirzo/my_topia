const { GetProductsWebPage, GetProductWebPage } = require("../controller/ProductController");
const { errorHandler } = require("../utils/errorHandler");

function WebPageRoute(fastify, options, done) {
  // Get All Products for Products sales Page
  fastify.get("/products/all", {
    schema: {
      tags: ["WebPage"],
      query: {
        type: "object",
        properties: {
          category: {
            type: "string",
            default: "",
          },
        },
      },
    },
    handler: errorHandler(GetProductsWebPage),
  });

  fastify.get('/product/:id', {
    schema: {
      tags: ["WebPage"],
    },
    handler: errorHandler(GetProductWebPage),
  })

  done();
}

module.exports = WebPageRoute;
