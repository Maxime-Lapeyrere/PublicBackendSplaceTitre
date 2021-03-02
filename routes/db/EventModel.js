const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
    admin: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    users: [{type: mongoose.Schema.Types.ObjectId, ref: 'users'}],
    title: String,
    address: String,
    place: {type: mongoose.Schema.Types.ObjectId, ref: 'places'},
    time: Date,
    level : Number,
    handiSport: Boolean,
    mix: Boolean
})

const EventModel = mongoose.model('events', eventSchema)
module.exports = EventModel