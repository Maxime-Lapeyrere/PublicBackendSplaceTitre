const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    text: String,
    createdAt: Date,
    user: {
        _id : String,
        name: String,
        avatar: String
    }
})

const ConvSchema = new mongoose.Schema({
    name : String,
    users: [{type: mongoose.Schema.Types.ObjectId, ref: 'users'}],
    messages: [MessageSchema],
    group : Boolean, 
    lastMessage: String
})


const ConvModel = mongoose.model('conversations', ConvSchema)

module.exports = ConvModel
