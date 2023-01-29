const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: String,
    password: String,
    image: String, 
    rooms: Array,
    projects: Array,
    adminof: Array,
    spectating: Array,
    contributing: Array
    
})

module.exports = mongoose.model("User", UserSchema);