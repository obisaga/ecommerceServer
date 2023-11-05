import express from "express";
import Product from "../models/Product.js"
import errorHandler from "../middlewares/errorHandler.js";

const productsRouter = express.Router()
const secret = process.env.SECRET;


//create a new product
productsRouter.post("/", async (req, res, next) => {
    try {
        // const {title, description, image, categories, availability{size, amount}, color, price} = req.body;
        const response = await Product.create(req.body)
        res.status(201).json({message: "Item added"}) 
    } catch (err) {
        console.log(err)
        return next() }
}, errorHandler)


//get all products
productsRouter.get("/", async (req, res, next) => {
    try {
        const response = await Product.find()
        res.status(200).json(response) 
    } catch (err) {
        console.log(err)
        return next() }
}, errorHandler)


//get one product by id
productsRouter.get("/:id", async (req, res, next) => {
    try {
        const response = await Product.findById(req.params.id)
        if(!response){
            return next({statusCode: 404, message: `Product not found`})
        
        }

        res.status(200).json(response) 
    } catch (err) {
        console.log(err)
        return next() }
}, errorHandler)

//change product data
productsRouter.put("/:id", async (req, res, next) => {
    try {
        const {id} = req.params
        const response = await Product.findByIdAndUpdate(id, req.body, {new:true})
        
        if(!response){
            return next({statusCode: 404, message: `Product not found`})
        
        }
        res.status(200).json(response) 
    } catch (err) {
        console.log(err)
        return next() }
}, errorHandler)

//delete product by id
productsRouter.delete("/:id", async (req, res, next) => {
    try {
        const {id} = req.params
        const response = await Product.findByIdAndDelete(id)

        if(!response){
            return next({statusCode: 404, message: `Product not found`})
        }
        res.status(200).json({message: "Product deleted successfully!"}) 
    } catch (err) {
        console.log(err)
        return next() }
}, errorHandler)


export default productsRouter
