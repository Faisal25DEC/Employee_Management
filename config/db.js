const mongoose = require("mongoose");
require("dotenv").config();
const uri = process.env.MONGO_URI;

const connection = mongoose.connect(uri);

module.exports = connection;
