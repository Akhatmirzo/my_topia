const Admin = require("../model/AdminModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.registerAdmin = async (req, res) => {
  const { phoneNumber, password } = req.body;

  if ((!phoneNumber, !password)) {
    return res.status(400).send({
      success: false,
      error: "Phone number or Password is required",
    });
  }

  const foundUser = await Admin.findOne({ phoneNumber });

  if (foundUser) {
    return res.status(400).send({
      success: false,
      error: "This user has already registered",
    });
  }

  const HashedPassword = await bcrypt.hash(password, 10);

  //? Creating new admin
  const admin = new Admin({
    phoneNumber,
    password: HashedPassword,
  });

  await admin.save();

  const token = jwt.sign(
    {
      phoneNumber,
      role: "admin",
    },
    process.env.jwt_secret_key
  );

  res.status(201).send({
    success: true,
    message: "Admin created successfully",
    token,
    role: "admin",
  });
};

exports.loginAdmin = async (req, res) => {
  const { phoneNumber, password } = req.body;

  if (!phoneNumber || !password) {
    return res.status(400).send({
      success: false,
      message: "Phone number or Password is required",
    });
  }

  try {
    const findAdmin = await Admin.findOne({ phoneNumber });

    if (!findAdmin) {
      return res.status(404).send({
        success: false,
        message: "Admin not found",
      });
    }

    if (findAdmin) {
      const isMatch = await bcrypt.compare(password, findAdmin.password);

      if (!isMatch) {
        return res.status(400).send({
          success: false,
          message: "Invalid Password",
        });
      }

      const token = jwt.sign(
        {
          phoneNumber: findAdmin.phoneNumber,
          role: "admin",
        },
        process.env.JWT_SECRET_KEY
      );

      return res.status(200).send({
        success: true,
        message: "Admin successfully authenticated",
        token,
      });
    }
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "An error occurred",
      error: error.message,
    });
  }
};
