import express from "express";
import User from "../models/User.js"
const usersRouter = express.Router()
const secret = process.env.SECRET;


//create a new user
usersRouter.post("/", async (req, res) => {
    try {
        const {firstName, lastName, birth, email, password} = req.body;
        const response = await User.create({firstName, lastName, birth, email, password})
        res.status(201).json(response) 
    } catch (error) {
        res.status(401).json({message: "Invalid entry"})
    }
})


//get all users
usersRouter.get("/", async (req, res) => {
    try {
        const response = await User.find()
        res.status(201).json(response) 
    } catch (error) {
        res.status(401).json({message: "Invalid entry"})
    }
})


//get one user by id
usersRouter.get("/:id", async (req, res) => {
    try {
        const response = await User.findOne({_id: req.params.id})
        res.status(201).json(response) 
    } catch (error) {
        res.status(401).json({message: "Invalid entry"})
    }
})


//change user data
usersRouter.put("/:id", async (req, res) => {
    try {
        const {firstName, lastName, birth, password} = req.body
        const response = await User.findOne({firstName, lastName, birth, password})
        
        res.status(201).json(response) 
    } catch (error) {
        res.status(401).json({message: "Invalid entry"})
    }
})




export default usersRouter
