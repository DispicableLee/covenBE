var ObjectID = require("mongodb").ObjectId;

const express = require("express");
const router = express.Router();


const e = require("express");
const User = require("../../models/User");

//======================= USER ENDPOINTS ===============================
//======================================================================

//POST a new user
//http://localhost:4002/api/v2/endPoints/new/user
router.post("/new/user", async (req,res)=>{
    const newUser = new User(req.body)
    newUser.save().catch((err) => console.log(err));
    return res.status(200).send(newUser)
})


//===================== ROOM ENDPOINTS =================================
//======================================================================
//POST a new room
//http://localhost:4002/api/v2/endPoints/new/room
// router.post("/new/room", async(req,res)=>{
//     const room = await 
// })











module.exports = router;