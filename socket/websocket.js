const webSocket = require("socket.io");
const Admin = require("../model/AdminModel");
const Employer = require("../model/EmployerModel");
const fastify = require("fastify")();

const server = fastify.server;
const io = webSocket(server, {
  cors: {
    origin: "*",
    methods: "*",
  },
});

const getReceiverSocketId = ({ role, receiverId }) => {
  if (receiverId) return userSocketMap[receiverId];
  else if (role === "employer") {
    let socketData = [];
    for (const element of employerSocketMap) {
      socketData.push(element);
    }
    return socketData;
  }
};

const userSocketMap = {}; // {userId: socketId}
const employerSocketMap = {}; // {userId: socketId}
let adminSocketMap = null; // {userId: socketId}

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
        return;
      }

      const { phoneNumber, role } = decoded;

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
    }
  );

  // socket.on()
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    delete userSocketMap[userId];
  });
});

module.exports = { fastify, io, server, getReceiverSocketId };
