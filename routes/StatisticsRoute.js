const { getStatistics } = require("../controller/StatisticsController");
const auth = require("../middlewares/auth");
const { errorHandler } = require("../utils/errorHandler");

function StatisticsRoute(fastify, options, done) {
  fastify.get("/", {
    schema: {
      tags: ["Statistics"],
      preHandler: [auth(["admin"])],
      query: {
        type: "object",
        properties: {
          date: { type: "string" },
          dateType: {
            type: "string",
            enum: ["day", "month", "year"],
            default: "day",
          },
          // ... other properties
        },
      },
      headers: {
        authorization: {
          type: "string",
          description: "Administrator Token",
        },
      },
    },
    handler: errorHandler(getStatistics),
  });

  done();
}

module.exports = StatisticsRoute;
