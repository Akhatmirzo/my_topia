const webSocket = require("socket.io");
const Admin = require("../model/AdminModel");
const Employer = require("../model/EmployerModel");
const jwt = require("jsonwebtoken");
const fastify = require("fastify")();

const userSocketMap = {}; // {userId: socketId}
const employerSocketMap = {}; // {userId: socketId}
let adminSocketMap = null; // {userId: socketId}

const server = fastify.server;
const io = webSocket(server, {
  cors: {
    origin: "http://13.60.185.148",
    methods: "*",
  },
});

const getReceiverSocketId = ({ role, receiverId }) => {
  if (receiverId) return employerSocketMap[receiverId];
  else if (role === "employer") {
    return employerSocketMap;
  } else if (role === "admin") {
    return adminSocketMap;
  }
};

io.on("connection", async (socket) => {
  console.log("a user connected", socket.id);
  const token = socket.handshake.query.authorization;
  let userId = null;

  // io.emit()
  await jwt.verify(
    token,
    process.env.jwt_secret_key,
    async function (err, decoded) {
      if (err) {
        console.log("Error verifying", socket.id);
        return;
      }

      const { phoneNumber, role } = decoded;

      console.log(phoneNumber, role, socket.id);

      if (role === "admin") {
        const user = await Admin.findOne({ phoneNumber }).exec();

        if (user) {
          userId = user._id.toString();

          if (userId != "undefined") adminSocketMap = socket.id;
        }
      }

      if (role === "employer") {
        const user = await Employer.findOne({ phoneNumber }).exec();

        if (user) {
          userId = user._id.toString();

          if (userId != "undefined") employerSocketMap[userId] = socket.id;
        }
      }

      console.log(employerSocketMap, adminSocketMap);
    }
  );

  // socket.on()
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    delete userSocketMap[userId];
  });
});

module.exports = { fastify, io, server, getReceiverSocketId };
