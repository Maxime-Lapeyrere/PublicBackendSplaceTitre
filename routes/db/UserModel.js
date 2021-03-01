const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    exemple : String,
})


const Model = mongoose.model('nameofcollection', userSchema);