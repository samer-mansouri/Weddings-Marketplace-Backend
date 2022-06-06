const Joi = require('joi');
const mongoose = require('mongoose');
const User = mongoose.model('User');



function validateUser(user) {
    const schema = Joi.object({
        firstName: Joi.string().min(5).max(50).required().messages({
          "any.required": "First Name is required",
          "string.empty": "First Name is not allowed to be empty",
          "string.min" : "First Name length must be at least 5 characters long",
          "string.max": "First Name length must be less than or equal to 50 characters long"
        }),
        lastName: Joi.string().min(5).max(50).required().messages({
          "any.required": "Last Name is required",
          "string.empty": "Last Name is not allowed to be empty",
          "string.min" : "Last Name length must be at least 5 characters long",
          "string.max": "Last Name length must be less than or equal to 50 characters long"
        }),
        email: Joi.string().email({ tlds: { allow: false } }).min(5).max(255).required().messages({
          "any.required": "Email is required",
          "string.empty": "Email is not allowed to be empty",
          "string.min" : "Email length must be at least 5 characters long",
          "string.max": "Email length must be less than or equal to 255 characters long",
          "string.email": "Email must be a valid email"
        }),
        password: Joi.string().min(8).max(255).required().messages({
          "any.required": "Password is required",
          "string.empty": "Password is not allowed to be empty",
          "string.min" : "Password length must be at least 5 characters long",
          "string.max": "Password length must be less than or equal to 255 characters long",
        })
    });
  return schema.validate(user);
}


const initializeUser = (
  firstName, lastName, picture, address, email, gender, role, password
) => {
  let user = new User()
  user.firstName = firstName;
  user.lastName = lastName;
  user.picture = picture;
  user.address = address;
  user.email = email;
  user.gender = gender;
  user.password = password;
  user.role = role;
  return user
}

module.exports = { validateUser, initializeUser } ;