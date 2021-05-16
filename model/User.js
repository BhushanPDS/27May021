const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  lastname: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  companyname: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
  email: {
    type: String,
    required: true,
    min: 6,
    max: 255,
  },
 
  password: {
    type: String,
    required: true,
    min: 6,
    max: 1024,
  },
  confirmpassword: {
    type: String,
    required: true,
    min: 6,
    max: 1024,
  },
  
});

module.exports = mongoose.model("User", userSchema);