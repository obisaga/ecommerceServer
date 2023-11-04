import express from "express";
import User from "../models/User.js"
import Cart from "../models/Cart.js"
import Order from "../models/Order.js"

const usersRouter = express.Router()

// const secret = process.env.SECRET;


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
        res.status(200).json(response) 
    } catch (error) {
        res.status(500).json({message: "Invalid entry"})
    }
})


//get one user by id
usersRouter.get("/:id", async (req, res) => {
    try {
        const response = await User.findOne({_id: req.params.id})
        res.status(200).json(response) 
    } catch (error) {
        res.status(500).json({message: "Invalid entry"})
    }
})


//change user data
usersRouter.put("/:id", async (req, res) => {
    try {
        const {id} = req.params
        const {firstName, lastName, birth, password} = req.body
        const response = await User.findByIdAndUpdate(id, {firstName, lastName, birth, password}, {new:true})
        
        if(!response){
            res.status(404).json({message: "User not found"})
        }
        res.status(200).json(response) 
    } catch (error) {
        res.status(500).json({message: "Invalid entry"})
    }
})

usersRouter.delete("/:id", async (req, res) => {
    try {
        const {id} = req.params
        const response = await User.findByIdAndDelete(id)

        if(!response){
           return res.status(404).json({message: "User not found"})
        }
        res.status(200).json({message: "User deleted successfully!"}) 
    } catch (error) {
        res.status(500).json({message: "Invalid entry"})
    }
})



// usersRouter.post("/reserve/:userId", async (req, res) => {
//     try {
//         const response = await Cart.find({userId: req.params.userId})
//         res.status(200).json({message: response}) 
//         const {userId} = response.userId
//         const {product} = response.products[0].productId
//         const {productQty} = response.products[0].quantity
//         const pushOrder = await Order.create({userId: userId, products.productId, products.quantity})
//         res.status(201).json(pushOrder) 

//     } catch (error) {
//         res.status(500).json({message: "Invalid entry"})
//     }
// })



export default usersRouter
