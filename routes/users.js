var express = require('express');
var router = express.Router();

const fileUpload = require('express-fileupload')

//signup route, same used for 1st registering user then registering its preferences 
router.post('/sign-up', (req,res) => {
  
  //body : username, email, password, fav sports (array), handiSport, country (from geo)
  //check if email already exists in DB
  //check if password has sufficient strength with RegEx
  //if all pass, bcrypt password
  //then save user to DB, res.json a token for the local storage and send an email confirmation

})

//basic sign-in
router.post('/sign-in', (req,res) => {

  //body : username or email and password
  //check if user exists
  // compare body password with encrypted one
  // if pass, res.json a token for the local storage
  
})

//modif profil/preferences ( pas la photo de prof)
router.put('/edit-profile', (req,res) => {
   // 
})


//upload photo de profil et edit current
router.put('/edit-photo', (req,res) => {
  
})

router.post('/get-my-events', (req,res) => {
  //populate events from user.events foreign keys
})

module.exports = router;
