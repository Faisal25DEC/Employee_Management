const express = require("express");
const bcrypt = require("bcrypt");
const UserModel = require("../models/user.models");
const jwt = require("jsonwebtoken");
const { authenticate } = require("../middlewares/authenticate");

const userRouter = express.Router();

userRouter.get("/", authenticate, async (req, res) => {
  const userId = req.userId;
  const user = await UserModel.findOne({ _id: userId });
  res.send(user);
});

userRouter.post("/signup", (req, res) => {
  const { name, email, password } = req.body;
  bcrypt.hash(password, 10, async function (err, hash) {
    if (err) {
      res.status(400).send("bad request");
    }
    await UserModel.create({ name, email, password: hash });
    res.status(200).send("user created");
  });
});
userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (user) {
    bcrypt.compare(password, user.password, function (err, result) {
      if (err) {
        res.status(400).send("bad request");
      } else {
        const token = jwt.sign({ userId: user._id }, "secretkey");
        console.log(token);
        res.send({ msg: "login successful", token: token });
      }
    });
  } else {
    res.status(401).send("user not found");
  }
});

module.exports = userRouter;
