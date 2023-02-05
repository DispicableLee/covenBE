const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    content: String,
    sender: String,
    recipient: String,
    room: String,
    project: String
    
})

module.exports = mongoose.model("Message", MessageSchema);