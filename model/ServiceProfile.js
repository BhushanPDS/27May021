const mongoose = require("mongoose");

const serviceprofileSchema = new mongoose.Schema({

  serviceprofilename: {
    type: String,
    required: false,
    

  },
  tag:
  {
      key:
      {
          type:String,
          required:false
      },
      value:
      {
          type:String,
          required:false
      }
  }

  
});

module.exports = mongoose.model("serviceprofile", serviceprofileSchema);