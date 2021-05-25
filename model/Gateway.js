const mongoose = require("mongoose");

const gatewaySchema = new mongoose.Schema({

 
  Arn:
  {
    type:String,
    required:false
  },
  Id:
  {
    type:String,
    required:false
  }

  
});

module.exports = mongoose.model("gateway", gatewaySchema);
