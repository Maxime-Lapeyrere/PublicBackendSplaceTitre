const mongoose = require('mongoose');

const favoriteSportSchema = new mongoose.Schema({
    name: String,
    id: String,
    isPicked: Boolean,
    isChosen: Boolean,
    icon: String
})

const genderSearchSchema = new mongoose.Schema({
    name: String,
    isChosen: Boolean
})

const userSchema = new mongoose.Schema({
    username: {type: String, unique: true},
    email: {type: String, unique: true},
    password: String,
    birthday: Date,
    gender: String,
    genderSearch: [genderSearchSchema],
    distanceSearch: Number, // in km
    physicalCondition: Number,
    phoneNumber: String,
    handiSport: Boolean,
    geolocation: {
        latitude: Number,
        longitude: Number
    },
    premium: Boolean,
    friendsList: [{type: mongoose.Schema.Types.ObjectId, ref: 'users'}],
    teams: [{type: mongoose.Schema.Types.ObjectId, ref: 'teams'}],
    profilePicture: String,
    bio: String,
    ageRange: [Number],
    jobTitle: String,
    education: String,
    joinedEvents: [{type: mongoose.Schema.Types.ObjectId, ref: 'events'}], //historique d'events et events à venir ici, traitement sera fait sur le back ou sur le front
    country: String,
    blockedUsers: [{type: mongoose.Schema.Types.ObjectId, ref: 'users'}],
    favoriteSports: [favoriteSportSchema],
    favoritePlaces: [{type: mongoose.Schema.Types.ObjectId, ref: 'places'}],
    club: [String], //(?)
    language: String,
    conversations: [{type: mongoose.Schema.Types.ObjectId, ref: 'conversations'}],
    connectionToken: String, // to be used to authenticate through the app, also, will be stored in local storage
    resetToken : String,
    resetTokenExpirationDate: Date
})

const UserModel = mongoose.model('users', userSchema);
module.exports = UserModel