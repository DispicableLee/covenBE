const mongoose = require("mongoose");

const URL = "mongodb+srv://rob123:rob123@cluster0.bwyorwr.mongodb.net/?retryWrites=true&w=majority";

const connectDB = async () =>{
    await mongoose.connect(URL, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    });
    console.log("mongoDB successfully connected");
}; 









module.exports = connectDB;