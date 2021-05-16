const Joi = require("@hapi/joi");
const  registerValidation  = (data) => 
{
  const schema = Joi.object({
    firstname: Joi.string().min(3).max(255).required(),
    lastname: Joi.string().min(3).max(255).required(),
    companyname: Joi.string().min(3).max(255).required(),
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(8).max(1024).required(),
    confirmpassword: Joi.string().min(8).max(1024).required()
    
  });
  return schema.validate(data);
};
const loginValidation = data => {

    const schema = Joi.object({
       
        email: Joi.string().min(6).max(255).required().email(),
        password: Joi.string().min(6).max(1024).required()
      });
      return schema.validate(data);
   
    
};

module.exports = {
  registerValidation,
  loginValidation
  
};