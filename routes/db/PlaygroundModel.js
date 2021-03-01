const mongoose = require('mongoose')

const playgroundSchema = new mongoose.Schema({
    name: String,
    location: {
        latitude: Number,
        longitude: Number
    },
    address: String,
    sports: [String],
    affluence: String,
    free: Boolean,
    public: Boolean,
    contact: [String],
    covering: String,
    icon: String
})

const PlaygroundModel = mongoose.model('playgrounds', playgroundSchema)
module.exports = PlaygroundModel