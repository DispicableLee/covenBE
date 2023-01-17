const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const RoomSchema = new Schema({
    name: String,
    image: String, 
    admins: Array,
    projects: Array,
    adminof: Array,
    spectators: Array
    
})

module.exports = mongoose.model("Room", RoomSchema);