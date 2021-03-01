const mongoose = require('mongoose')

const playgroundSchema = new mongoose.Schema({
    name: String,
    location: {
        latitude: Number,
        longitude: Number
    },
    address: String,
    sport: [String],
    affluence: String,
    free: Boolean,
    public: Boolean,
    contact: [String],
    covering: String
})

const PlaygroundModel = mongoose.model('playgrounds', playgroundSchema)
module.exports = PlaygroundModel