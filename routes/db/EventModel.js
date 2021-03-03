const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
    admin: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    invitedUsers: [{type: mongoose.Schema.Types.ObjectId, ref: 'users'}],
    participatingUsers: [{type: mongoose.Schema.Types.ObjectId, ref: 'users'}],
    title: String,
    address: String,
    sport: String,
    sportName: String,
    sportImage: String,
    place: {type: mongoose.Schema.Types.ObjectId, ref: 'places'},
    time: Date,
    level : Number,
    handiSport: Boolean,
    mix: Boolean,
    privateEvent: Boolean
})

const EventModel = mongoose.model('events', eventSchema)
module.exports = EventModel