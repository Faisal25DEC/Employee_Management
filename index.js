const express = require("express");
const cors = require("cors");
const connection = require("./config/db");
const userRouter = require("./routes/user.routes");
const employeeRouter = require("./routes/employee.routes");

const app = express();

const port = 8080;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("basic api endpiont");
});

app.use("/users", userRouter);
app.use("/employees", employeeRouter);

app.listen(port, async () => {
  try {
    await connection;
    console.log("listening on ", port);
    console.log("database connected");
  } catch (err) {
    console.log(err);
  }
});
