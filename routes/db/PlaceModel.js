const mongoose = require('mongoose')

const placeSchema = new mongoose.Schema({
    apiID: String,
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
    icons: [String],
    events: [{type: mongoose.Schema.Types.ObjectId, ref: 'events'}]
})

const PlaceModel = mongoose.model('places', placeSchema)
module.exports = PlaceModel