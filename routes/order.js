import express from "express";
import Order from "../models/Order.js"
import tokenAuth from "../middlewares/adminAuth.js";
import errorHandler from "../middlewares/errorHandler.js";


const ordersRouter = express.Router()
const secret = process.env.SECRET;


//create a new order
ordersRouter.post("/", tokenAuth, async (req, res, next) => {
    try {
        const token = req.body.token
        const response = await Order.create(req.body)
        res.status(201).json(response) 
    } catch (err) {
        console.log(err)
        return next() }
}, errorHandler)


//get all orders
ordersRouter.get("/", tokenAuth, async (req, res, next) => {
    try {
        const response = await Order.find()
        res.status(200).json(response) 
    } catch (err) {
        console.log(err)
        return next() }
}, errorHandler)


//get one order by id
ordersRouter.get("/:id", tokenAuth, async (req, res, next) => {
    try {
        const response = await Order.findById(req.params.id)
        if(!response){
            return next({statusCode: 404, message: `Order with the id ${id} doesn't exist`})
         }  
         res.status(200).json(response)
     }  catch (err) {
        console.log(err)
        return next() }
}, errorHandler)

//delete order by id
ordersRouter.delete("/:id", tokenAuth, async (req, res, next) => {
    try {
        const {id} = req.params
        const response = await Order.findByIdAndDelete(id)

        if(!response){
            return next({statusCode: 404, message: `Order with the id ${id} doesn't exist`})
        }
        res.status(200).json({message: "Order deleted successfully!"}) 
    }  catch (err) {
        console.log(err)
        return next() }
}, errorHandler)



export default ordersRouter
