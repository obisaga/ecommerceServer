import express from "express";
import Order from "../models/Order.js"

const ordersRouter = express.Router()
const secret = process.env.SECRET;


//create a new order
ordersRouter.post("/", async (req, res) => {
    try {
        // const {title, description, image, categories, availability{size, amount}, color, price} = req.body;
        const response = await Order.create(req.body)
        res.status(201).json(response) 
    } catch (error) {
        res.status(500).json({message: "Invalid entry"})
    }
})


//get all orders
ordersRouter.get("/", async (req, res) => {
    try {
        const response = await Order.find()
        res.status(200).json(response) 
    } catch (error) {
        res.status(500).json({message: "Invalid entry"})
    }
})


// //get one product by id
// ordersRouter.get("/:id", async (req, res) => {
//     try {
//         const response = await Product.findById(req.params.id)
//         res.status(200).json(response) 
//     } catch (error) {
//         res.status(500).json({message: "Invalid entry"})
//     }
// })




export default ordersRouter
