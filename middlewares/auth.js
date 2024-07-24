const Admin = require("../model/AdminModel");
const jwt = require("jsonwebtoken");

const auth = (permissions) => {
  return (req, res, next) => {
    const token = req.headers.authorization || req.cookies.token;

    if (!token) {
      return res.status(401).send({
        success: false,
        message: "Token was not found",
      });
    }

    try {
      jwt.verify(token, process.env.jwt_secret_key, async (err, decoded) => {
        if (err) {
          return res.status(503).send({
            success: false,
            message: "Failed to authenticate user.",
          });
        }

        const { role, phoneNumber } = decoded;

        if (permissions.includes(role)) {
          switch (role) {
            case "admin":
              const admin = await Admin.findOne({ phoneNumber });
              if (!admin)
                return res
                  .status(401)
                  .send({ success: false, message: "Unathorized Admin" });

              req.userId = admin._id;
              req.role = role;
              next();
              break;

            default:
              return res.status(401).send({
                success: false,
                message: `This role is not available to get data`,
              });
          }
        } else {
          return res.status(401).send({
            success: false,
            message: `${String(
              role
            ).toUpperCase()} is not permitted to get data!`,
          });
        }
      });
    } catch (error) {
      return res.status(500).send({
        success: false,
        message: error.message,
      });
    }
  };
};

module.exports = auth;
