const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');


const  response  = require("express");


// middlewares
app.use(express.json()); // for body parser
// connect to db
mongoose.connect(
  "mongodb://NewUser:gp8LTeMZ8ShbUifD@cluster0-shard-00-00.ys07t.mongodb.net:27017,cluster0-shard-00-01.ys07t.mongodb.net:27017,cluster0-shard-00-02.ys07t.mongodb.net:27017/information?ssl=true&replicaSet=atlas-f80oxb-shard-0&authSource=admin&retryWrites=true&w=majority",
{
  useNewUrlParser: true,
  useUnifiedTopology: true,
},
() => console.log("connected to db")
);
// import routes
const authRoutes = require("./routes/auth");
// route middlewares
app.use("/api/user", authRoutes);
app.listen(3008, () => console.log("server is running..."));