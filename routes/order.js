import express from "express";
import Order from "../models/Order.js"

const ordersRouter = express.Router()
const secret = process.env.SECRET;


//create a new order
ordersRouter.post("/", async (req, res) => {
    try {
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


//get one order by id
ordersRouter.get("/:id", async (req, res) => {
    try {
        const response = await Order.findById(req.params.id)
        if(!response){
            return res.status(404).json({message: "Order not found"})
         }  
         res.status(200).json(response)
     } catch (error) {
        res.status(500).json({message: "Invalid entry"})
    }
})

//delete order by id
ordersRouter.delete("/:id", async (req, res) => {
    try {
        const {id} = req.params
        const response = await Order.findByIdAndDelete(id)

        if(!response){
           return res.status(404).json({message: "Order not found"})
        }
        res.status(200).json({message: "Order deleted successfully!"}) 
    } catch (error) {
        res.status(500).json({message: "Invalid entry"})
    }
})






export default ordersRouter
