const express = require('express');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cloudinary = require('../config/cloudinary');


const { validateUser, initializeUser } = require('../helpers/UserHelpers')
const profilePicLink = 'https://res.cloudinary.com/daoeyqp1y/image/upload/v1650154718/idat0nakfbvdbiateuw3.png'

let capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

let createUser = async (req, res) =>{
    

    try {
        console.log(req.body)
    const { error } = validateUser(
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
      }
    );
    if(error){
      console.log(error)
      //console.log(error);
      //console.log(error.message)
      res.status(400).send({"Error" : error.message})
    } else {
      let user = await User.findOne({ email:  req.body.email });
      if (user){
        res.status().status(409).send({'message': 'User with this email already exists ! '});
      } else {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(req.body.password, salt);
        initializeUser(
          capitalizeFirstLetter(req.body.firstName),
          capitalizeFirstLetter(req.body.lastName),
           profilePicLink,
           req.body.address,
           req.body.email,
           req.body.gender,
           req.body.role,
           hash)
        .save((err, doc) => {
          if(!err){
            res.status(201).send({'message': 'User created with success !'});
          } else {
            console.log(err);
            res.status(500).send({"Error": "Internal Server Error"})
          }
        });
      }
    }
    } catch(err) {
        console.log(err)
        res.status(500).send({"Error": "Internal Server Error"})
    }
  
}

const getUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id })
  .populate('garage')
  .exec();
  if(!user){
    res.status(404).send({'message': 'User not found !'});
  } else {
    res.status(200).send(user);
  }
}

const getUsers = async (req, res) => {
  const users = await User.find({})
  .populate('garage')
  .exec();
  if(!users){
    res.status(404).send({'message': 'Users not found !'});
  } else {
    res.status(200).send(users);
  }
}



const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ 'message': 'Email and password are required.' });

  const foundUser = await User.findOne({ email: email }).exec();
  console.log(foundUser)
  if (!foundUser) return res.sendStatus(404).send({"Error": "User not found"}); //Unauthorized 
  // evaluate password 
  else {
    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
        // create JWTs
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "email": foundUser.email,
                    "user_id": foundUser._id,
                    "role": foundUser?.role,
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1000s' }
        );
        const refreshToken = jwt.sign(
            { "email": foundUser.email },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        // Saving refreshToken with current user
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();

        res.json({ refreshToken, accessToken, currentUser: foundUser._id, role: foundUser.role });
    } else {
        res.sendStatus(401);
    }
  }
  
}

const handleLogout = async (req, res) => {
  // On client, also delete the accessToken

  const refreshToken = req.body.refreshToken;
  if (!refreshToken) return res.sendStatus(204); //No content

  // Is refreshToken in db?
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
      return res.sendStatus(204);
  }

  // Delete refreshToken in db
  foundUser.refreshToken = '';
  const result = await foundUser.save();
  console.log(result);

  res.sendStatus(204);
}

const handleRefreshToken = async (req, res) => {
  console.log(req.body.refreshToken);
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) return res.sendStatus(401);
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) return res.sendStatus(403); //Forbidden 
  // evaluate jwt 
  jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
          if (err || foundUser.email !== decoded.email) return res.sendStatus(403);
          const accessToken = jwt.sign(
              {
                "UserInfo": {
                  "email": foundUser.email,
                  "user_id": foundUser._id,
                  "role": foundUser?.role,
                }
              },
              process.env.ACCESS_TOKEN_SECRET,
              { expiresIn: '1000s' }
          );
          res.json({ accessToken })
      }
  );
}


const updateUserInformations = (req, res) => {
  if (req.body.email) {
    User.find({ email: req.body.email })

    .then(user => {
      if (user.length > 0 && user[0]._id != req.user) {
        res.status(409).send({'message': 'Email already exists !'});
      } else {
        User.findByIdAndUpdate(req.user , req.body, { new: true })
        .then(user => {
          if (!user) {
            res.status(404).send({'message': 'User not found !'});
          } else {
            res.status(200).send(user);
          }
        })
        .catch(err => {
          res.status(500).send({'message': 'Error updating user'});
        });
      }
    })
    .catch(err => {
      res.status(500).send({'message': 'Error updating user'});
    });
  } else {

    User.findOneAndUpdate({ _id: req.user }, req.body, { new: true }, (err, doc) => {
      if (!err) {
        res.send(doc);
      } else {
        console.log('Error in User Update :' + JSON.stringify(err, undefined, 2));
      }
    });
  }
}

const updateUserProfilePicture = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
  User.findOneAndUpdate({ _id: req.user }, { picture: result.secure_url }, (err, doc) => {
    if (!err) {
      res.send({
        message: 'User profile picture updated successfully',
        picture: result.secure_url
      });
    } else {
      res.status(400).send({
        message: 'User profile picture not updated',
        error: err
      });
    }
  });
  } catch (error) {
    res.status(400).send({
      message: 'User profile picture not updated',
      error: error
    });
  }
}


const deleteMyAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) {
      res.status(404).send({'message': 'User not found !'});
    } else {
      await User.findByIdAndDelete(req.user);
      res.status(200).send({'message': 'User deleted successfully'});
    }
  } catch (error) {
    res.status(500).send({'message': 'Error deleting user'});
  }
}
  
module.exports = {
  createUser,
  handleLogin,
  handleLogout,
  handleRefreshToken,
  getUser,
  getUsers,
  updateUserInformations,
  updateUserProfilePicture,
  deleteMyAccount
};