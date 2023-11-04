import express from "express";
import Cart from "../models/Cart.js"

const cartRouter = express.Router()
const secret = process.env.SECRET;


//create a new cart
cartRouter.post("/", async (req, res) => {
    try {
        const response = await Cart.create(req.body)
        res.status(201).json(response) 
    } catch (error) {
        res.status(500).json({message: "Invalid entry"})
    }
})


//get all carts - ADMIN
cartRouter.get("/", async (req, res) => {
    try {
        const response = await Cart.find()
        res.status(200).json(response) 
    } catch (error) {
        res.status(500).json({message: "Invalid entry"})
    }
})


//get one cart by cartId
cartRouter.get("/:id", async (req, res) => {
    try {
        const response = await Cart.findById(req.params.id)

        if(!response){
            res.status(404).json({message: "Cart not found"})
        }
        res.status(200).json(response) 
    } catch (error) {
        res.status(500).json({message: "Invalid entry"})
    }
})

//get one cart by userId
cartRouter.get("/user/:userId", async (req, res) => {
    try {
        const response = await Cart.find({userId: req.params.userId})
        if(!response){
            res.status(404).json({message: "This user has no cart"})
        }
        
        res.status(200).json(response) 
    } catch (error) {
        res.status(500).json({message: "Invalid entry"})
    }
})

// update cart by CART ID
cartRouter.put("/:id", async (req, res) => {
    try {
        const {id} = req.params
        const response = await Cart.findByIdAndUpdate(id, req.body, {new:true})
        if(!response){
            res.status(404).json({message: "Cart not found"})
        }
        res.status(200).json({message: "Cart updated successfully!"}) 
    } catch (error) {
        res.status(500).json({message: "Invalid entry"})
    }
})


// update cart by USERS ID
cartRouter.put("/user/:id", async (req, res) => {
    try {
        const {id} = req.params
        const response = await Cart.findOneAndUpdate({userId:id}, req.body, {new:true})
        if(!response){
            res.status(404).json({message: "Cart not found"})
        }
        res.status(200).json({message: "Cart updated successfully!"}) 
    } catch (error) {
        res.status(500).json({message: "Invalid entry"})
    }
})


// delete cart 
cartRouter.delete("/:id", async (req, res) => {
    try {
        const {id} = req.params
        const response = await Cart.findByIdAndDelete(id)
        if(!response){
            res.status(404).json({message: "Cart not found"})
        }
        res.status(200).json({message: "Cart deleted successfully!"}) 
    } catch (error) {
        res.status(500).json({message: "Invalid entry"})
    }
})







export default cartRouter
