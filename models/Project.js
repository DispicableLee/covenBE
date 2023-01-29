const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
    name: String,
    image: String,
    userid: String,
    description: String,
    contributors: Array,
    spectators: Array,
    link: String
    
})

module.exports = mongoose.model("Project", ProjectSchema);