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

// const accountSid = "ACf5817ddc104d5034171def0074992c6a";
// const authToken = "4665920efb6a2a1dfbd92c3eebcb84a2";

// const twilioClient = require("twilio")(accountSid, authToken);

const user = require("../model/User");
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey("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")
const secretLoginCode = Date.now().toString().slice(-6);



//otp for 


var digits = '0123456789';

    var otpLength = 6;
    var otp = '';
    step =60;

    for(let i=1; i<=otpLength; i++)

    {

        var index = Math.floor(Math.random()*(digits.length));
       

        otp = otp + digits[index];
        

    }
    console.log(otp);
  



  

let transporter = nodemailer.createTransport({
  // host: "varadeb278@gmail.com",
  port: 465,
  secure: true,
  service: 'Gmail',

  auth: {
      user: 'noreply@gmail.com',
      pass: 'PranitaDS@35',
  }

});

// validation
const { registerValidation , loginValidation} = require("../validation");


router.post("/register", async (req, res) => {
   // validate the user

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
    from: 'noreply.com', // Change to your verified sender
    subject: 'Sending with SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: `To reset your password please verify the given OTP ${otp}`,
    }
  let data = { temproryMail_otp: secretLoginCode };
  sgMail.send(msg)
    .then((response) => 
    {
      if (response != null) 
      {
        userHelper.updateByEmail(req.body.email, data);
      }
      console.log(response[0].statusCode)
      console.log(response[0].headers)
    })
    .catch((error) => 
    {
      console.error(error)
    })
  }
  });


  
  router.post('/verify', function (req, res) {
  
      if (req.body.otp == otp) {
          res.send("otp verified");
      }
      else {
          res.render('otp', { msg: 'otp is incorrect' });
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
    subject: 'Sending with SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
    html: `To reset your password please verify the given OTP ${otp}`,
    }
  let data = { temproryMail_otp: secretLoginCode };
  sgMail.send(msg)
    .then((response) => 
    {
      if (response != null) 
      {
        userHelper.updateByEmail(req.body.email, data);
      }
      console.log(response[0].statusCode)
      console.log(response[0].headers)
    })
    .catch((error) => 
    {
      console.error(error)
    })
  }
  });
           
  
module.exports = router;