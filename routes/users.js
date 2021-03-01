var express = require('express');
var router = express.Router();

const uid2 = require('uid2')
const bcrypt = require('bcrypt')
const fileUpload = require('express-fileupload')
const fs = require('fs')

const UserModel = require('./db/UserModel')

//HELPER FUNCTIONS

const checkTokenValidity = (date) => {
  return date < Date.now() ? false : true
}

const checkEmailValidity = (email) => {
  const emailFormat = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailFormat.test(String(email).toLowerCase())
}

const checkPasswordStrength = (password) => {
  const mediumRegex = /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/;
  return mediumRegex.test(password)
}

//END

//signup route, same used for 1st registering user then registering its preferences 
router.post('/sign-up', async (req,res) => {
  
  //body : username, email, password, fav sports (array), handiSport, country (from geo)
  //check if email or username already exists in DB
  //check if password has sufficient strength with RegEx (minimum would be medium)
  //if all pass, bcrypt password
  //then save user to DB, res.json a bool and a token for the local storage and send an email confirmation

  const {username, email, password, favoriteSports, bio, age, gender, handiSport, country, phoneNumber} = req.body

  if (!username || !email || !password || !gender || !country || handiSport === undefined || !phoneNumber) {
    res.json({result:false, message: "Un champ obligatoire est manquant."})
    return
  }

  if (!checkEmailValidity(email)) {
    res.json({result:false, message: "Cet email n'est pas valide."})
    return
  }

  const foundUsername = UserModel.findOne({username})
  const foundEmail = UserModel.findOne({email})
  if (foundUsername) {
    res.json({result:false, message: "Ce nom d'utilisateur existe déjà."})
    return
  }
  if (foundEmail) {
    res.json({result:false, message: "Cet email est déjà utilisé."})
    return
  }

  if (!checkPasswordStrength(password)) {
    res.json({result:false, message: "Ce mot de passe n'est pas assez sécurisé."})
    return
  }

  try {
    const hash = bcrypt.hashSync(password, 10)

    const newUser = new UserModel({
     username,
      email,
      password: hash,
      age,
      favoriteSports,
      bio,
      gender,
      handiSport,
      country,
      phoneNumber,
      connectionToken: uid2(64)
    })

    const savedUser = await newUser.save()
    res.json({result: true, token: savedUser.connectionToken})
  } catch (error) {
    console.log(error)
    res.json({result:false, message: "Une erreur est survenue. Essayez plus tard."})
  }
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
