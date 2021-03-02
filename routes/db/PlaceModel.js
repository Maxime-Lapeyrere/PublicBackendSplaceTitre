const mongoose = require('mongoose')

const placeSchema = new mongoose.Schema({
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
    icons: [String]
})

const PlaceModel = mongoose.model('places', placeSchema)
module.exports = PlaceModel