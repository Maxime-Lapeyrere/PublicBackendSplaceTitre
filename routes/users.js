var express = require('express');
var router = express.Router();

const fileUpload = require('express-fileupload')
const fs = require('fs')

//signup route, same used for 1st registering user then registering its preferences 
router.post('/sign-up', (req,res) => {
  
  //body : username, email, password, fav sports (array), handiSport, country (from geo)
  //check if email already exists in DB
  //check if password has sufficient strength with RegEx
  //if all pass, bcrypt password
  //then save user to DB, res.json a bool and a token for the local storage and send an email confirmation

})

//basic sign-in
router.post('/sign-in', (req,res) => {

  //body : username or email and password
  //check if user exists
  // compare body password with encrypted one
  // if pass, res.json a bool and a token for the local storage
  
})

//modif profil/preferences ( pas la photo de prof)
router.put('/edit-profile', (req,res) => {
  // body : username, email, password, fav sports (array), handiSport, country (from geo) and user token
  //find user by its token and update data
  //res json a bool
})


//upload photo de profil et edit current
router.put('/edit-photo', (req,res) => {
  //body : form-data, get the photo data via fileupload
  //save photo data to /tmp with FS (method .mv())
  //upload photo to cloudinary
  //if success, delete photo with FS method unlinkSync and res json the url >> save the url to DB
})

router.post('/get-my-events', (req,res) => {
  //body : user token
  //find user
  //populate events from user.events foreign keys
  //res.json a bool and the list of the events
})

module.exports = router;
