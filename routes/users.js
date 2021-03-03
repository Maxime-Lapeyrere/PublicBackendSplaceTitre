var express = require('express')
var router = express.Router()

const uid2 = require('uid2')
const bcrypt = require('bcrypt')
const fileUpload = require('express-fileupload')
const fs = require('fs')
const uniqid = require('uniqid')

const cloudinary = require('cloudinary').v2
cloudinary.config({
  cloud_name: "splace", 
  api_key: "556322414353259", 
  api_secret: "F44dnfebUjDfuqNjjJ_AzdVF3IY"
})

const UserModel = require('./db/UserModel')

//HELPER FUNCTIONS

const checkDateValidity = (date) => {
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

//signup route
router.post('/sign-up', async (req,res) => {

  const {username, email, password, favoriteSports, bio, age, gender, handiSport, country, phoneNumber} = req.body

  if (!username || !email || !password || !gender || !country || handiSport === undefined || !phoneNumber) {
    res.json({result:false, message: "Un champ obligatoire est manquant."})
    return
  }

  if (!checkEmailValidity(email)) {
    res.json({result:false, message: "Cet email n'est pas valide."})
    return
  }

  const foundUsername = await UserModel.findOne({username})
  const foundEmail = await UserModel.findOne({email})
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
      language: null,
      geolocation: {
        latitude: null,
        longitude: null
      },
      phoneNumber,
      premium: false,
      profilePicture: null,
      connectionToken: uid2(64),
      resetToken: null,
      resetTokenExpirationDate: null
    })

    const savedUser = await newUser.save()
    res.json({result: true, token: savedUser.connectionToken})
  } catch (error) {
    console.log(error)
    res.json({result:false, message: "Une erreur est survenue. Essayez plus tard."})
  }
})

//sign-in
router.post('/sign-in', async (req,res) => {

  const {email, password} = req.body

  const found = await UserModel.findOne({email})
  if (!found) {
    res.json({result: false, message: "L'email ou le mot de passe est incorrect."})
    return
  }
  bcrypt.compare(password, found.password).then(response => {
    response ? res.json({result:true, token: found.connectionToken}) : res.json({result:false, message: "L'email ou le mot de passe est incorrect."})
  })

})

//modif profil/preferences ( pas la photo de prof)
router.put('/edit-profile', (req,res) => {
  // body : username, email, password, fav sports (array), handiSport, country (from geo) and user token
  //find user by its token and update data
  //res json a bool
})


//upload photo de profil et edit current
router.put('/upload-profile-picture', (req,res) => {

  //body : user token and file (if possible)

  const path = './tmp/'+uniqid()+'.jpg'
  await req.files.photo.mv(path, (err) => {
    if (err) {
      res.json({result: false, error: "Issue copying photo to /tmp folder"})
      return
    }
  })

  try {
    await cloudinary.uploader.upload(path, {folder: "UserPictureProfile"},async (error, response) => {
      if (error) {
        fs.unlinkSync(path)
        res.json({result: false, error: "Issue uploading photo to cloudinary"})
      } else {
        fs.unlinkSync(path)

        const user = await UserModel.findOne({connectionToken: req.body.token})
        user.profilePicture = response.secure_url
        await user.save()

        res.json({result: true})
      }
    })
  } catch (error) {
    console.log("in catch block")
    console.log(error)
  }

})

router.post('/get-my-events', (req,res) => {
  //body : user token
  //find user
  //populate events from user.events foreign keys
  //res.json a bool and the list of the events
})

module.exports = router;
