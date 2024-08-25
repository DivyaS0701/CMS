require("dotenv").config({path: "./config/config.env"});
const express = require("express");
const morgan = require("morgan");
const connectDb = require("./config/db");

const auth = require("./middlewares/auth");
const app = express();


//middlewares
app.use(express.json()); //parses and returns in json format
app.use(morgan("tiny")); //gets endpoints
app.use(require("cors")());

//routes
app.get("/protected", auth, (req, res) => {
  return res.status(200).json({...req.user._doc});
});
app.use("/api", require("./routes/auth"));

//server configurations
app.get("/", (req, res) => {
  res.send("hellooo");
});
const PORT = process.env.PORT || 8000;
app.listen(PORT, async () => {
  try {
    await connectDb();
    console.log(`server listening on port: ${PORT}`);
  } catch (err) {
    console.log(err);
  }
});
