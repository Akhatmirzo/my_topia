const { default: mongoose } = require("mongoose");

const EmployerSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (value) {
        // Regular expression to validate phone format
        return /^(\+998)\d{2}\d{3}\d{2}\d{2}$/.test(value);
      },
      message: (props) => `${props.value} is not a valid Phone Number!`,
    },
  },
  fullname: {
    type: String,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  }
});

const Employer = mongoose.model("Employer", EmployerSchema);

module.exports = Employer;
