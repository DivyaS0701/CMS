const mongoose = require("mongoose");

const connectDb = async () => {
  return mongoose
    .connect("mongodb://localhost/connectMern")
    .then(() => {
      console.log("Connection successfully established");
    })
    .catch((err) => console.log(err));
};

module.exports = connectDb;
