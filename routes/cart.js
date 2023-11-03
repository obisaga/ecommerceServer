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


//get all carts
cartRouter.get("/", async (req, res) => {
    try {
        const response = await Cart.find()
        res.status(200).json(response) 
    } catch (error) {
        res.status(500).json({message: "Invalid entry"})
    }
})


// //get one product by id
// cartRouter.get("/:id", async (req, res) => {
//     try {
//         const response = await Product.findById(req.params.id)
//         res.status(200).json(response) 
//     } catch (error) {
//         res.status(500).json({message: "Invalid entry"})
//     }
// })




export default cartRouter
