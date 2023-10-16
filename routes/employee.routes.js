const express = require("express");
const UserModel = require("../models/user.models");
const jwt = require("jsonwebtoken");
const { authenticate } = require("../middlewares/authenticate");
const EmployeeModel = require("../models/employee.model");

const employeeRouter = express.Router();

const checkPagination = (req, res, next) => {
  const { page } = req.query;
  req.pagination = {
    page: page,
    limit: 5,
  };
  next();
};
const checkSort = async (req, res, next) => {
  const { sort, order } = req.query;
  const { page, limit } = req.pagination;
  let sortQuery = {};
  if (sort) {
    sortQuery["sort"] = sort;
    if (order) {
      sortQuery["order"] = order == "desc" ? -1 : 1;
    }

    const sortedData = await EmployeeModel.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ [sortQuery.sort]: sortQuery.order });
    req.sortedData = sortedData;
  } else {
    const sortedData = await EmployeeModel.find()
      .skip((page - 1) * limit)
      .limit(limit);
    req.sortedData = sortedData;
  }
  next();
};
const checkFilter = async (req, res, next) => {
  const { department } = req.query;
  const sortedData = req.sortedData;
  req.filteredData = sortedData.filter((ele) => {
    return !department || ele.department == department;
  });
  next();
};
employeeRouter.get(
  "/",
  authenticate,
  checkPagination,
  checkSort,
  checkFilter,
  async (req, res) => {
    const userId = req.userId;
    try {
      // const employees = await EmployeeModel.find({ userId });
      res.send(req.filteredData);
    } catch (err) {
      res.status(400).send({ msg: "bad request" });
    }
  }
);
employeeRouter.post("/post", authenticate, async (req, res) => {
  const { firstName, lastName, department, salary, email } = req.body;
  try {
    await EmployeeModel.create({
      firstName,
      lastName,
      department,
      salary,
      email,
      userId: req.userId,
    });

    res.send("employee created");
  } catch (err) {
    console.log(err);
    res.status(400).send("check whether u added all fields");
  }
});
employeeRouter.put("/put/:employeeId", authenticate, async (req, res) => {
  const { employeeId } = req.params;
  const payload = req.body;
  await EmployeeModel.findByIdAndUpdate(
    {
      _id: employeeId,
    },
    { ...payload }
  );

  res.send("employee created");
});
employeeRouter.delete("/delete/:employeeId", authenticate, async (req, res) => {
  const { employeeId } = req.params;

  await EmployeeModel.findByIdAndDelete({
    _id: employeeId,
  });

  res.send("employee deleted");
});

module.exports = employeeRouter;
