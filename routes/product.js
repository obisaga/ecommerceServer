import express from "express";
import Product from "../models/Product.js"

const productsRouter = express.Router()
const secret = process.env.SECRET;


//create a new product
productsRouter.post("/", async (req, res) => {
    try {
        // const {title, description, image, categories, availability{size, amount}, color, price} = req.body;
        const response = await Product.create(req.body)
        res.status(201).json(response) 
    } catch (error) {
        res.status(500).json({message: "Invalid entry"})
    }
})


//get all products
productsRouter.get("/", async (req, res) => {
    try {
        const response = await Product.find()
        res.status(200).json(response) 
    } catch (error) {
        res.status(500).json({message: "Invalid entry"})
    }
})


//get one product by id
productsRouter.get("/:id", async (req, res) => {
    try {
        const response = await Product.findById(req.params.id)
        res.status(200).json(response) 
    } catch (error) {
        res.status(500).json({message: "Invalid entry"})
    }
})




export default productsRouter
