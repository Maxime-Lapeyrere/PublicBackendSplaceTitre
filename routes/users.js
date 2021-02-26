var express = require('express');
var router = express.Router();

const fileUpload = require('express-fileupload')

//signup route, same used for 1st registering user then registering its preferences 
router.post('/sign-up', (req,res) => {
  //> here will be checked if user already exists and if password has sufficient strength
  if (!req.body.isSettingPreferences) {

  } else {
    
  }
})

//basic sign-in
router.post('/sign-in', (req,res) => {
  
})

//modif profil ( pas la photo de prof)
router.put('/edit-profile', (req,res) => {
  
})


//upload photo de profil et edit current
router.put('/edit-photo', (req,res) => {
  
})

router.post('/get-my-events', (req,res) => {
  //populate events from user.events foreign keys
})

module.exports = router;
