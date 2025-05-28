const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = function () {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(function () {
      console.log("MongoDB connected");
    })
    .catch(function (err) {
      console.error("Database connection error:", err);
    });
};

module.exports = connectDB;
