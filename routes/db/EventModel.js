const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
    admin: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    users: [{type: mongoose.Schema.Types.ObjectId, ref: 'users'}],
    title: String,
    address: String,
    playground: {type: mongoose.Schema.Types.ObjectId, ref: 'places'},
    
})

const EventModel = mongoose.model('events', eventSchema)
module.exports = EventModel