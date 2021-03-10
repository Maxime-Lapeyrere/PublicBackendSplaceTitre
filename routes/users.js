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
console.log(req.body);
  const {username, email, password, favoriteSports, bio, birthday, gender, handiSport, country, phoneNumber} = req.body

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

    const birthdate = new Date()
    birthdate.setFullYear(1996,8,23)
    //TBC

    const newUser = new UserModel({
      username,
      email,
      password: hash,
      birthday:Date.parse(birthday),
      favoriteSports,
      bio,
      gender,
      genderSearch: [
        {
          name: "Femme",
          isChosen: false
        },
        {
          name: "Homme",
          isChosen: true
        },
        {
          name: "Autre",
          isChosen: false
        },
        {
          name: "Mixte",
          isChosen: false
        }
      ],
      handiSport,
      country,
      language: null,
      // geolocation: {
      //   latitude: geolocation.latitude ? geolocation.latitude : null,
      //   longitude: geolocation.longitude ? geolocation.longitude : null
      // },
      phoneNumber,
      premium: false,
      profilePicture: null,
      connectionToken: uid2(64),
      resetToken: null,
      resetTokenExpirationDate: null,
      distanceSearch: 5, // in km
      ageRange: [18,40] ,
      physicalCondition: null,
      timeAvailable: [
        {
          time: "morning",
          isAvailable: false
        },
        {
          time: "noon",
          isAvailable: false
        },
        {
          time: "evening",
          isAvailable: true
        }
      ]
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

  console.log("sur la route sign in", req.body);

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
router.put('/upload-profile-picture', async (req,res) => {

  //body : user token and file (if possible)

  const user = await UserModel.findOne({connectionToken: req.body.token})
  if (!user) {
    res.json({result:false, message:"Un problème est survenu lors du chargement de votre profil.", disconnectUser: true})
    return
  }

  const path = './tmp/'+uniqid()+'.jpg'
  await req.files.photo.mv(path, (err) => {
    if (err) {
      res.json({result: false, message: "Un problème est survenu lors de la sauvegarde de votre photo."})
      return
    }
  })

  try {
    await cloudinary.uploader.upload(path, {folder: "UserPictureProfile"},async (error, response) => {
      if (error) {
        fs.unlinkSync(path)
        res.json({result: false, message: "Un problème est survenu lors du chargement de votre photo de profil sur nos serveurs."})
      } else {
        fs.unlinkSync(path)

        user.profilePicture = response.secure_url
        await user.save()

        res.json({result: true})
      }
    })
  } catch (error) {
    res.json({result:false,  message: "Un problème est survenu."})
  }

})

router.post('/get-my-events', async (req,res) => {
  //body : user token
  //idéalement, on enverra seulement des informations succinctes et on donnerait plus d'info via l'event id si l'event est séléctionné

  const user = await UserModel.findOne({connectionToken: req.body.token}).populate('joinedEvents').exec()
  if (!user) {
    res.json({result:false, message:"Un problème est survenu lors du chargement de votre profil.", disconnectUser: true})
    return
  }

  const events = []
  user.joinedEvents.forEach(e => {
    const {_id,participatingUsers,title,sportName,sportImage,time} = e
    events.push({
      eventId: _id,
      participatingUsers,
      title,
      sportName,
      sportImage,
      time
    })
  })
  res.json({result:true, events})

})

router.post('/get-preferences', async (req,res) => {

  const {token} = req.body

  const user = await UserModel.findOne({connectionToken: token})

  if (!user) {
    res.json({result:false, message:"Un problème est survenu lors du chargement de votre profil.", disconnectUser: true})
    return
  }
  const {favoriteSports, favoritePlaces, club,birthday,bio,gender,handiSport,country,language,profilePicture,premium,distanceSearch,genderSearch,ageRange,timeAvailable} = user
  
  res.json({result: true, preferences: {
    favoriteSports,
    favoritePlaces,
    club,
    birthday,
    bio,
    gender,
    handiSport,
    country,
    language,
    profilePicture,
    premium,
    distanceSearch, 
    genderSearch,
    ageRange,
    timeAvailable
  }})

})

router.post('/save-preferences', async (req,res) => {

  const {token} = req.body
  const {favoriteSports,favoritePlaces,club,birthday,bio,gender,handiSport,country,language,profilePicture,premium,distanceSearch,genderSearch,ageRange,timeAvailable} = req.body.preferences

  const user = await UserModel.findOne({connectionToken: token})

  if (!user) {
    res.json({result:false, message:"Un problème est survenu lors du chargement de votre profil.", disconnectUser: true})
    return
  }

    user.favoriteSports = favoriteSports
    user.favoritePlaces = favoritePlaces
    user.club = club
    user.birthday = birthday
    user.bio = bio
    user.gender = gender
    user.handiSport = handiSport
    user.country= country
    user.language=language
    user.profilePicture=profilePicture
    user.premium = premium
    user.distanceSearch = distanceSearch
    user.genderSearch = genderSearch
    user.ageRange = ageRange
    user.timeAvailable = timeAvailable

    await user.save()
    res.json({result:true, message:"Préférence enregistrée."})

})

module.exports = router;
