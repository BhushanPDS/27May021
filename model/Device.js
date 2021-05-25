const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema({

  lorawanverion: {
    type: String,
    required: true,
    

  },
  deviceprofile: {
    type: String,
    required: true
  },
  serviceprofile: {
    type: String,
    required: true
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

module.exports = mongoose.model("device", deviceSchema);