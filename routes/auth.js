const router = require("express").Router();
const User = require("../model/User");
const Joi = require("@hapi/joi");
const bcrypt = require("bcrypt");
var nodemailer = require("nodemailer");
const  response  = require("express");
const path = require('path')
const exphbs = require('express-handlebars')
const bodyparser = require('body-parser');
const app = require('express');
const cors = require('cors');
const Gateway = require("../model/Gateway");
const Device = require("../model/Device");
const DeviceProfile = require("../model/DeviceProfile");

const ServiceProfile = require("../model/ServiceProfile");


var AWS = require('aws-sdk');
AWS.config.update({region:'us-east-1'});


var config = ({
  "apiVersion": "2020-11-22",
  "accessKeyId": "AKIA4PNGHYBCIQ5OPPHU",
  "secretAccessKey": "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",
  "region": "us-east-1"
  
});
 

// const sgMail = require('@sendgrid/mail')
// sgMail.setApiKey("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")
// const secretLoginCode = Date.now().toString().slice(-6);


//Otp  Creation

var digits = '0123456789';

    var otpLength = 6;
    var otp = '';
    limit=60;

    for(let i=1; i<=otpLength; i++)

    {

        var index = Math.floor(Math.random()*(digits.length));
       

        otp = otp + digits[index];
        

    }
    console.log(otp);
  



// validation
const { registerValidation , loginValidation} = require("../validation");


router.post("/register", async (req, res) => {
  

   password=req.body.password;
   confirmpassword=req.body.confirmpassword;
   if(password!=confirmpassword)
   {
        res.status(201).json({
            msg:"password & confirmpassword did not match"
        })
   }
   else
   {
   const { error } = registerValidation(req.body);
   if (error) {
     return res.status(400).json({ error: error.details[0].message   
     });
    }
    if (error) return res.status(400).json({ error: error.details[0].message });
    const isEmailExist = await User.findOne({ email: req.body.email });
    if (isEmailExist)
    return res.status(400).json({ error: "Email already exists" });


    // hash the password
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);
    
   const user = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    companyname:req.body.companyname,
   
    email: req.body.email,
    // password: req.body.
    password,
    confirmpassword:req.body.confirmpassword,
   
  });
  try {
    const savedUser = await user.save();
    res.json({ error: null, data: savedUser });
  } catch (error) {
    res.status(400).json({ error });
  }
}
});
// login route
router.post("/login", async (req, res) => {
  // validate the user
  // create token
 
  const { error } = loginValidation(req.body);
  // throw validation errors
  if (error) return res.status(400).json({ error:   error.details[0].message });
  const user = await User.findOne({ email: req.body.email });
  // throw error when email is wrong
  if (!user) return res.status(400).json({ error: "Email is wrong" });
  // check for password correctness
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
  return res.status(400).json({ error: "Password is wrong" });
  res.json({
    
    data: {
      message: "Login successful",
    },
  });
});
router.post("/senMailForForgotPassword",  async (req, res) =>
{
  email=req.body.email;
  const user = await User.findOne({ email: req.body.email });
  // throw error when email is wrong
  if (!user) return res.status(400).json({ error: "Email is wrong" });
   else
 {
  const secretLoginCode = Date.now().toString().slice(-6);
  const msg = {
    to: req.body.email, // Change to your recipient
    from: 'varadeb278@gmail.com', // Change to your verified sender
    subject: 'Sending with SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: `To reset your password please verify the given OTP ${otp}`,
    }
  let data = { temproryMail_otp: secretLoginCode };
  sgMail.send(msg)
    .then((response) => 
    {
      
      console.log(response[0].statusCode)
      console.log(response[0].headers)
    })
    .catch((error) => 
    {
      console.error(error)
    })
  }
  });

  router.post('/verify', async (req, res) =>
  {
    try{
    if (req.body.otp == otp) {
        res.send("Otp  verified");
    }
    else {
      res.send("incorrect otp");

  }
  }catch(error)
  {
    console.log(error);
  }
});



router.post("/resend",  async (req, res) =>
{
  email=req.body.email;
  const user = await User.findOne({ email: req.body.email });
  // throw error when email is wrong
  if (!user) return res.status(400).json({ error: "Email is wrong" });
   else
 {
  const secretLoginCode = Date.now().toString().slice(-6);
  const msg = {
    to: req.body.email, // Change to your recipient
    from: 'bhushan.varade@thinkitive.com', // Change to your verified sender
    subject: 'your resend otp ',
    text: 'and easy to do anywhere, even with Node.js',
    html: `Your Resend otp ${otp}`,
    }
  let data = { temproryMail_otp: secretLoginCode };
  sgMail.send(msg)
    .then((response) => 
    {
      
      console.log(response[0].statusCode)
      console.log(response[0].headers)
    })
    .catch((error) => 
    {
      console.error(error)
    })
  }
  });

  // router.post("/wireless-gateways", async (req, res) => {
  
    
  
  //   ClientRequestToken=req.body.ClientRequestToken;
  //   gatewayEUI=req.body.gatewayEUI;
  //   cgatewayEUI=req.body.cgatewayEUI;
  //   RFregion=req.body.RFregion;
  //   name=req.body.name;
  //   description=req.body.description;
  //   tag=req.body.tag;
  //   Arn=req.body.Arn;
  //   Id=req.body.Id;

  //    if(gatewayEUI!=cgatewayEUI)
  //   {
  //       res.status(201).json({
  //           msg:"gatewayEUI & cgatewayEUI did not match"
  //       })
  //   }
   
  //  {
    

  //    const gateway = new Gateway({
  //     ClientRequestToken:req.body.ClientRequestToken,
  //     gatewayEUI: req.body.gatewayEUI,
  //     cgatewayEUI: req.body.cgatewayEUI,
  //     RFregion:req.body.RFregion,
  //     name:req.body.name,
  //     description:req.body.description,
  //     tag:req.body.tag,
  //     Arn:req.body.Arn,
  //     Id:req.body.Id
     
   
     
  //   });
  //   try {
  //     const savedGateway = await gateway.save();
  //     res.json({ error: null, data: savedGateway });
  //   } catch (error) {
  //     res.status(400).json({ error });
  //   }
  //   }
  // });



  // Json Data
  router.post("/wireless-gateway", async (req, res) => {
  
    
  
    
    Arn=req.body.Arn;
    Id=req.body.Id;

     const gateway = new Gateway({
    
      Arn:req.body.Arn,
      Id:req.body.Id
     
   
     
    });
    try {
      const savedGateway = await gateway.save();
      res.json({ error: null, data: savedGateway });
    } catch (error) {
      res.status(400).json({ error });
    }
    }
  );
  
  
  router.post("/add_device", async (req, res) => {
  


    lorawanverion=req.body.lorawanverion;
    deviceprofile=req.body.deviceprofile;
    serviceprofile=req.body.serviceprofile;
    tag=req.body.tag;
   
   {
    
     const device = new  Device({
      lorawanverion:req.body.lorawanverion,
      deviceprofile:req.body.deviceprofile,
      serviceprofile:req.body.serviceprofile,
      tag:req.body.tag
     
   
     
    });
    try {
      const savedDevice = await device.save();
      res.json({ error: null, data: savedDevice });
    } catch (error) {
      res.status(400).json({ error });
    }
    }
  });


  router.post("/add_deviceprofile", async (req, res) => {
  


    deviceprofilename=req.body.deviceprofilename;
    RFRegion=req.body.RFRegion;
    MAC_Version=req.body.MAC_Version;
    RegionalParameter=req.body.RegionalParameter;
    MaxEIRP=req.body.MaxEIRP;
    MaxDutyCycle=req.body.MaxDutyCycle;
    tag=req.body.tag;
    ClassBTimeout=req.body.ClassBTimeout;
    PingSlotFreq=req.body.PingSlotFreq;
    PingSlotPeriod=req.body.PingSlotPeriod;
    PingSlotDR=req.body.PingSlotDR;
    ClassCTimeout=req.body.ClassCTimeout;
   
   {
    
     const deviceprofile = new  DeviceProfile({
      deviceprofilename:req.body.deviceprofilename,
      RFRegion:req.body.RFRegion,
      MAC_Version:req.body.MAC_Version,
      RegionalParameter:req.body.RegionalParameter,
      MaxEIRP:req.body.MaxEIRP,
      MaxDutyCycle:req.body.MaxDutyCycle,
      tag:req.body.tag,
      ClassBTimeout:req.body.ClassBTimeout,
      PingSlotFreq:req.body.PingSlotFreq,
      PingSlotPeriod:req.body.PingSlotPeriod,
      PingSlotDR:req.body.PingSlotDR,
      ClassCTimeout:req.body.ClassCTimeout
   
     
    });
    try {
      const savedDeviceProfile = await deviceprofile.save();
      res.json({ error: null, data: savedDeviceProfile });
    } catch (error) {
      res.status(400).json({ error });
    }
    }
  });
  router.post("/add_serviceprofile", async (req, res) => {
  
    serviceprofilename=req.body.serviceprofilename;
    tag=req.body.tag;
   
   {
    
     const serviceprofile = new  ServiceProfile({
      serviceprofilename:req.body.serviceprofilename,
      tag:req.body.tag
   
     
    });
    try {
      const savedServiceProfile = await serviceprofile.save();
      res.json({ error: null, data: savedServiceProfile });
    } catch (error) {
      res.status(400).json({ error });
    }
    }
  });
module.exports = router;