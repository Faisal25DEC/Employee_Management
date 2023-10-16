const mongoose = require("mongoose");

const employeeSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  salary: { type: Number, required: true },
  userId: { type: String, required: true },
});

const EmployeeModel = mongoose.model("employee", employeeSchema);

module.exports = EmployeeModel;
