var ObjectID = require("mongodb").ObjectId;

const express = require("express");
const router = express.Router();


const e = require("express");
const Room = require("../../models/Room");
const User = require("../../models/User");
const Project = require("../../models/Project")
const Message = require("../../models/Message")

//======================= USER ENDPOINTS ===============================
//======================================================================

//POST a new user
//http://localhost:4002/api/v2/endPoints/new/user
router.post("/new/user", async (req,res)=>{
    const newUser = new User(req.body)
    newUser.save().catch((err) => console.log(err));
    return res.status(200).send(newUser)
})

//GET all users
//http://localhost:4002/api/v2/endPoints/search/all/users
router.get("/search/all/users", async(req,res)=>{
    const allUsers = await User.find()
    return res.status(200).send(allUsers)
})

//GET a single user by their id
//http://localhost:4002/api/v2/endPoints/search/user/:userid
router.get("/search/user/:userid", async(req,res)=>{
    const userid = req.params.userid
    const userObjectID = ObjectID(userid)
    const user = await User.findById(userObjectID)
    if(user){
        return res.status(200).send(user)
    }else{
        return res.status(400).send({})
    }
})

//GET a single user by LOGGING IN with USERNAME and PASSWORD
//http://localhost:4002/api/v2/endPoints/userlogin/:username/:password
router.get("/userlogin/:username/:password", async(req,res)=>{
    const user = await User.findOne({password: req.params.password})
    if(user.username==req.params.username){
        return res.status(200).send(user)
    }else{
        return res.status(400).send({})
    }
})







//===================== ROOM ENDPOINTS =================================
//======================================================================
//POST a new room
//http://localhost:4002/api/v2/endPoints/new/room/:userid
router.post("/new/room/:userid", async(req,res)=>{
    const userid = req.params.userid
    const userObjectID = ObjectID(userid)
    const user = await User.findById(userObjectID)
    if(user){
        var userRooms = user.rooms
        var userAdminOf = user.adminof
        const newRoom = new Room(req.body)
        newRoom.save().catch((err)=>console.log(err))
        userRooms.unshift(newRoom._id)
        userAdminOf.unshift(newRoom._id)
        var userQuery = {_id:user._id}
        var userUpdatedValues = {
            username: user.username,
            password: user.password,
            image: user.image, 
            rooms: userRooms,
            projects: user.projects,
            adminof: userAdminOf,
            spectating: user.spectating
        }
        await User.findOneAndUpdate(userQuery, userUpdatedValues)
        const roomAdmins = newRoom.admins
        roomAdmins.unshift(user._id)
        var roomQuery = {_id:newRoom._id}
        var roomUpdatedValues = {
            name: newRoom.name,
            image: newRoom.image, 
            admins: roomAdmins,
            projects: newRoom.projects,
        }
        await Room.findOneAndUpdate(roomQuery, roomUpdatedValues)
        return res.status(200).send(roomUpdatedValues)
    }else{
        return res.status(400).send({})
    }
})

//GET all rooms in room schema
//http://localhost:4002/api/v2/endPoints/search/all/rooms
router.get("/search/all/rooms", async(req,res)=>{
    const rooms = await Room.find()
    return res.status(200).send(rooms)
})

//GET a single room by id
//http://localhost:4002/api/v2/endPoints/search/room/:roomid
router.get("/search/room/:roomid", async(req,res)=>{
    const roomObjectId = ObjectID(req.params.roomid)
    const room = await Room.findById(roomObjectId)
    if(room){
        return res.status(200).send(room)
    }else{
        return res.status(400).send({})
    }
})

//GET all messages in a room
//http://localhost:4002/api/v2/endPoints/search/all/messages/room/:roomid
router.get("/search/all/messages/room/:roomid", async(req,res)=>{
    console.log("hi")
    const roomid = req.params.roomid
    const roomObjectId = ObjectID(roomid)
    const room = await Room.findById(roomObjectId)
    if(room){
        const roomMessages = room.messages
        const fetchedMessages = await Message.find({_id:{$in: roomMessages}})
        return res.status(200).send(fetchedMessages)
    }else{
        return res.status(400).send({})
    }
})




//========================== PROJECT ENDPOINTS ===========================
//========================================================================

//GET all projects
//http://localhost:4002/api/v2/endPoints/search/all/projects
router.get("/search/all/projects", async(req,res)=>{
    const allProjects = await Project.find()
    return res.status(200).send(allProjects)
})
//GET a single project and all its info by it's id
//http://localhost:4002/api/v2/endPoints/search/project/:projectid
router.get("/search/project/:projectid", async(req,res)=>{
    const projectid = req.params.projectid
    const projectObjectId = ObjectID(projectid)
    const project = await Project.findById(projectObjectId)
    // const projectContributors = await User.find({_id:{$in: project.contributors}})
    if(project){
        return res.status(200).send(project)
    }else{
        return res.status(400).send({})

    }
})

//GET all info about one project
    //contributors
    //spectators
    //messages
//http://localhost:4002/api/v2/endPoints/search/allprojectinfo/:projectid
router.get("/search/allprojectinfo/:projectid", async(req,res)=>{
    const projectid = req.params.projectid
    const projectObjectId = ObjectID(projectid)
    const project = await Project.findById(projectObjectId)
    if(project){
        const projectContributors = await User.find({_id:{$in: project.contributors}})
        const projectSpectators = await User.find({_id:{$in: project.spectators}})
        const projectMessages = await Message.find({_id:{$in: project.messages}})
        return res.status(200).send([projectContributors, projectSpectators, projectMessages])
    }else{
        return res.status(400).send({})
    }
})





//POST a new project
//http://localhost:4002/api/v2/endPoints/new/project/:userid
router.post("/new/project/:userid", async(req,res)=>{
    const userid = req.params.userid
    const userObjectID = ObjectID(userid)
    const user = await User.findById(userObjectID)
    if(user){
        const newProject = new Project(req.body)
        newProject.save().catch((err)=>console.log(err))
        const userProjects = user.projects
        const userAdminOf = user.adminof
        userProjects.unshift(newProject._id)
        userAdminOf.unshift(newProject._id)
        var userQuery = {_id:user._id}
        var userUpdatedValues = {
            username: user.username,
            password: user.password,
            image: user.image, 
            rooms: user.rooms,
            projects: userProjects,
            adminof: userAdminOf,
            spectating: user.spectating,
            contributing: user.contributing
        }
        await User.findOneAndUpdate(userQuery, userUpdatedValues)
        return res.status(200).send(newProject)
    }else{
        return res.status(400).send({})
    }
}) 

//PUT a spectator into a project's spectator array
//http://localhost:4002/api/v2/endPoints/spectator/:userid/:projectid
router.put("/spectator/:userid/:projectid", async(req,res)=>{
    const userid = req.params.userid
    const userObjectID = ObjectID(userid)
    const user = await User.findById(userObjectID)
    if(user){
        const projectid = req.params.projectid
        const projectObjectId = ObjectID(projectid)
        const project = await Project.findById(projectObjectId)
        if(project){
            const userSpectating = user.spectating
            userSpectating.unshift(project._id)
            var userQuery = {_id:user._id}
            var userUpdatedValues = {
                username: user.username,
                password: user.password,
                image: user.image, 
                rooms: userRooms,
                projects: userProjects,
                adminof: userAdminOf,
                spectating: userSpectating
            }
            var projectSpectators = project.spectators
            projectSpectators.unshift(user._id)
            var projectQuery = {_id:project._id}
            var projectUpdatedValues = {
                name: project.name,
                image: project.image,
                description: project.description,
                contributors: project.contributors,
                spectators: projectSpectators
            }
            await User.findOneAndUpdate(userQuery, userUpdatedValues)
            await Project.findOneAndUpdate(projectQuery, projectUpdatedValues)
            return res.status(200).send([userUpdatedValues, projectUpdatedValues])
        }else{
            return res.status(400).send({})
        }
    }else{
        return res.status(400).send({})
    }
})

//PUT a contributor into a project's contributor array 
//http://localhost:4002/api/v2/endPoints/contributor/:userid/:projectid
router.put("/contributor/:userid/:projectid", async(req,res)=>{
    const userid = req.params.userid
    const userObjectID = ObjectID(userid)
    const user = await User.findById(userObjectID)
    if(user){
        const projectid = req.params.projectid
        const projectObjectId = ObjectID(projectid)
        const project = await Project.findById(projectObjectId)
        if(project){
            //update userinfo
            var userContributing = user.contributing
            userContributing.unshift(project._id)
            var userQuery = {_id:user._id}
            var userUpdatedValues = {
                username: user.username,
                password: user.password,
                image: user.image, 
                rooms:user.rooms,
                projects:user.projects,
                adminof:user.adminof,
                spectating:user.spectating,
                contributing: userContributing
            }
            //update project info
            var projectContributors = project.contributors
            projectContributors.unshift(user._id)
            var projectQuery = {_id:project._id}
            var projectUpdatedValues = {
                name: project.name,
                image: project.image,
                userid: project.userid,
                description: project.description,
                contributors: projectContributors,
                spectators:project.spectators,
                link: project.link
            }
            await User.findOneAndUpdate(userQuery, userUpdatedValues)
            await Project.findOneAndUpdate(projectQuery, projectUpdatedValues)
            return res.status(200).send([userUpdatedValues, projectUpdatedValues])
        }else{
            return res.status(400).send({})
        }
    }else{
        return res.status(400).send({})
    }
})


//=========================== MESSAGE ENDPOINTS =========================================
//=======================================================================================
//POST - a user sends a message to another user
//http://localhost:4002/api/v2/endPoints/new/message/:senderid/:recieverid
router.post("/new/message/:recieverid", async(req,res)=>{
    const recieverID = req.params.recieverid
    const recieverObjectID = ObjectID(recieverID)
    const reciever = await User.findById(recieverObjectID)
    if(reciever){
        const newMessage = new Message(req.body)
        const messageId = newMessage._id
        const receiverMessages = reciever.messages
        receiverMessages.unshift(messageId)
        var recieverQuery = {_id: reciever._id}
        var receiverUpdatedValues = {     
            username: reciever.username,
            password: reciever.password,
            image: reciever.image, 
            rooms: reciever.rooms,
            projects: reciever.projects,
            adminof: reciever.adminof,
            spectating: reciever.spectating,
            contributing: reciever.contributing,
            messages: receiverMessages
        }
        await User.findOneAndUpdate(recieverQuery,receiverUpdatedValues)
        newMessage.save().catch((err)=>console.log(err))
        return res.status(200).send(newMessage)
    }else{
        return res.status(400).send({})
    }
})


//POST a new message to a room's message array
//http://localhost:4002/api/v2/endPoints/new/message/room/:userid/:roomid
router.post("/new/message/room/:senderid/:roomid", async(req,res)=>{
    //check if the room exists
    const roomid = req.params.roomid
    const roomObjectId = ObjectID(roomid)
    const room = await Room.findById(roomObjectId)
    if(room){
        //check if the sender exists
        const userid = req.params.senderid
        const userObjectID = ObjectID(userid)
        const user = await User.findById(userObjectID)
        if(user){
            //if both the room and the user exist, create the message
            const newMessage = new Message(req.body)
            //add the message id the user's message array
            const userMessages = user.messages
            userMessages.unshift(newMessage._id)
            //update users information
            var userQuery = {_id:user._id}
            var userUpdatedValues = {
                username: user.username,
                password: user.password,
                image: user.image, 
                rooms: user.rooms,
                projects: user.projects,
                adminof: user.adminof,
                spectating: user.spectating,
                contributing: user.contributing,
                messages: userMessages
            }
            //add message id to room message array
            const roomMessages = room.messages
            roomMessages.unshift(newMessage._id)
            var roomQuery = {_id:room._id}
            var roomUpdatedValues = {
                name: room.name,
                image: room.image, 
                admins: room.admins,
                projects: room.projects,
                messages: roomMessages
            }
            await User.findOneAndUpdate(userQuery, userUpdatedValues)
            await Room.findOneAndUpdate(roomQuery, roomUpdatedValues)
            newMessage.save().catch((err)=>console.log(err))
            return res.status(200).send([newMessage, userUpdatedValues, roomUpdatedValues])
        }else{
            return res.status(400).send({})
        }
    }else{
        return res.status(400).send({})
    }
})







module.exports = router;