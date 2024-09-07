const Employer = require("../model/EmployerModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { io, getReceiverSocketId } = require("../socket/websocket");

exports.employerRegister = async (req, res) => {
  const currentDate = new Date();
  const gmtPlus5Date = new Date(currentDate.getTime() + 5 * 60 * 60 * 1000);
  const { phoneNumber, fullname, password } = req.body;

  if (!phoneNumber || !fullname || !password) {
    return res.status(400).send({
      success: false,
      message: "phoneNumber and Fullname or password are required",
    });
  }

  const foundEmployer = await Employer.findOne({ phoneNumber });

  if (foundEmployer) {
    return res.status(400).send({
      success: false,
      message: "This Employer has already registered",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const employer = new Employer({
    phoneNumber,
    fullname,
    password: hashedPassword,
    createdAt: gmtPlus5Date,
    updatedAt: gmtPlus5Date,
  });

  await employer.save();

  return res.status(201).send({
    success: true,
    message: "Employer was successfully registered",
    role: "employer",
  });
};

exports.employerLogin = async (req, res) => {
  const { phoneNumber, password } = req.body;

  if (!phoneNumber)
    return res.status(400).send({
      success: false,
      message: "phoneNumber is required",
    });

  const employer = await Employer.findOne({ phoneNumber });

  if (!employer)
    return res.status(400).send({
      success: false,
      message: "Employer not found",
    });

  const isMatch = await bcrypt.compare(password, employer.password);

  if (!isMatch)
    return res.status(400).send({
      success: false,
      message: "Invalid password",
    });

  const token = jwt.sign(
    { phoneNumber, role: "employer" },
    process.env.jwt_secret_key
  );

  return res.status(200).send({
    success: true,
    message: "Employer was successfully logged in",
    role: "employer",
    token,
  });
};

exports.employerGetAll = async (req, res) => {
  const employers = await Employer.find();

  if (employers.length > 0) {
    return res.status(200).send({
      message: "Employers successfully found",
      employers,
    });
  }

  return res.status(404).send({
    success: false,
    message: "Employers not found",
  });
};

exports.employerGetOne = async (req, res) => {
  const { id } = req.params;

  if (id === "me") {
    const employer = await Employer.findById(req.userId);

    if (!employer) {
      return res.status(404).send({
        success: false,
        message: "Employer not found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Employer successfully found",
      employer,
    });
  }

  const employer = await Employer.findById(id);

  if (!employer) {
    return res.status(404).send({
      success: false,
      message: "Employer not found",
    });
  }

  return res.status(200).send({
    success: true,
    message: "Employer successfully found",
    employer,
  });
};

exports.employerUpdate = async (req, res) => {
  const currentDate = new Date();
  const gmtPlus5Date = new Date(currentDate.getTime() + 5 * 60 * 60 * 1000);
  const { id } = req.params;

  if (!id) {
    return res.status(400).send({
      success: false,
      message: "id is required",
    });
  }

  let hashedPassword = null;

  if (req.body.password) {
    hashedPassword = await bcrypt.hash(req.body.password, 10);
  }

  const editEmployer = {
    ...req.body,
    password: hashedPassword,
    updatedAt: gmtPlus5Date,
  };

  const employer = await Employer.findByIdAndUpdate(
    { _id: id },
    {
      $set: {
        ...editEmployer,
      },
    }
  );

  if (!employer) {
    return res.status(404).send({
      success: false,
      message: "Employer not found",
    });
  }

  const receiverId = getReceiverSocketId({ receiverId: id });
  console.log("refreshToken", receiverId);

  io.to(receiverId).emit("refreshToken", employer._id);

  return res.status(200).send({
    success: true,
    message: "Employer successfully updated",
  });
};

exports.employerDelete = async (req, res) => {
  const { id } = req.params;

  const employer = await Employer.findByIdAndDelete({ _id: id });

  if (!employer) {
    return res.status(404).send({
      success: false,
      message: "Employer not found",
    });
  }

  return res.status(200).send({
    success: true,
    message: "Employer successfully deleted",
  });
};
