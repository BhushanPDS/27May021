const mongoose = require("mongoose");

const deviceprofileSchema = new mongoose.Schema({

  deviceprofilename: {
    type: String,
    required: false,
    

  },
  RFRegion: {
    type: String,
    required: true
  },
  MAC_Version: {
    type: String,
    required: true
  },
  RegionalParameter: {
    type: String,
    required: true
  },
  MaxEIRP: {
    type: String,
    required: true
  },
  ClassBTimeout:{
    type:String,
    required:false
  },
  PingSlotFreq:
  {
    type:String,
    required:false

  },
  PingSlotPeriod:
  {
    type:String,
    required:false
  },
  PingSlotDR:{
    type:String,
    required:false
  },
  ClassCTimeout:{
    type:String,
    required:false
  },
  MaxDutyCycle: {
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

module.exports = mongoose.model("deviceprofile", deviceprofileSchema);