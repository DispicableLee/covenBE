var ObjectID = require("mongodb").ObjectId;

const express = require("express");
const router = express.Router();


const e = require("express");
const Room = require("../../models/Room");
const User = require("../../models/User");
const Project = require("../../models/Project")

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





//========================== PROJECT ENDPOINTS ===========================
//========================================================================

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
            rooms: userRooms,
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








module.exports = router;