const dotenv = require("dotenv");
dotenv.config();
const { default: mongoose } = require("mongoose");
const fastify = require("fastify")();
const fastifyIO = require("fastify-socket.io");
const requestIp = require("request-ip");
const cors = require("@fastify/cors");

//? Multer setup
const multer = require("fastify-multer");
fastify.register(multer.contentParser);
const path = require("path");

fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "/uploads"),
  prefix: "/uploads/", // optional: default '/'
});

fastify.register(fastifyIO, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

fastify.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
});

fastify.register(require("@fastify/swagger"), {
  exposeRoute: true,
  swagger: {
    info: {
      title: "MayTopia api",
      description: "This is the page of MayTopia api list",
      version: "1.0.0",
    },
    tags: [{ name: "Admin", description: "Admin related end-points" }],
  },
});

// swaagger endpoint
fastify.register(require("@fastify/swagger-ui"), {
  routePrefix: "/docs",
});

//? Routes
fastify.get("/start", { schema: { tags: ["API"] } }, (req, res) => {
  // res.send("Welcome to the API");
});

fastify.get("/", (req, res) => {
  res.sendFile("./index.html");
});

fastify.register(require("./routes/AdminRoute"), {
  prefix: "/api/admin",
});

fastify.register(require("./routes/EmployerRoute"), {
  prefix: "/api/employer",
});

fastify.register(require("./routes/CategoriesRoute"), {
  prefix: "/api/categories",
});

fastify.register(require("./routes/ProductRoute"), {
  prefix: "/api/products",
});

fastify.register(require("./routes/WebPageRoute"), {
  prefix: "/api/webpage",
});

fastify.register(require("./routes/OrdersRoute"), {
  prefix: "/api/orders",
});

fastify.ready((err) => {
  if (err) throw err;

  fastify.io.on("connection", (socket) => {
    console.log("A user connected", socket.id);
    fastify.io.to(socket.id).emit("myid", socket.id);
    const clientIp =
    socket.request.connection._peername;
    console.log("Client connected with IP, line 90: ", clientIp);
    // console.log(socket.handshake);

    socket.on("clientip", (ip) => {
      console.log("Local IP, Line 94: " + ip);
    });

    // socket.on("localIp", (ip) => {
    //   console.log(ip);
    // });

    // Ulanishni uzish
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
});

//? Connection to the database
mongoose
  .connect(process.env.DATABASE_URL_LOCAL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the local db");
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

//? Runs the server
fastify.listen({ port: process.env.PORT || 8000 }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  console.log(`Server is running on port ${process.env.PORT || 8000}`);
});
