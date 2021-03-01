const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: {type: String, unique: true},
    email: {type: String, unique: true},
    password: String,
    age: Number,
    gender: String,
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
    joinedEvents: [{type: mongoose.Schema.Types.ObjectId, ref: 'events'}], //historique d'events et events à venir ici, traitement sera fait sur le back ou sur le front
    country: String,
    blockedUser: [{type: mongoose.Schema.Types.ObjectId, ref: 'users'}],
    favoriteSports: [String],
    favoritePlaygrounds: [{type: mongoose.Schema.Types.ObjectId, ref: 'playgrounds'}],
    club: [String], //(?)
    language: String,
    conversations: [{type: mongoose.Schema.Types.ObjectId, ref: 'conversations'}],
    connectionToken: String, // to be used to authenticate through the app, also, will be stored in local storage
    resetToken : String,
    resetTokenExpirationDate: Date
})

export default mongoose.model('users', userSchema);