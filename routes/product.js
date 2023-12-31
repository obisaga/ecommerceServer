import express from "express";
import Product from "../models/Product.js"
import errorHandler from "../middlewares/errorHandler.js";

const productsRouter = express.Router()
const secret = process.env.SECRET;


//create a new product / ADMIN
productsRouter.post("/", async (req, res, next) => {
    try {
        // const {title, description, image, categories, availability{size, amount}, color, price} = req.body;
        const response = await Product.create(req.body)
        res.status(201).json({message: "Item added"}) 
    } catch (err) {
        console.log(err)
        return next() }
}, errorHandler)


// get products by SEARCH
// for example /search?categories=rings&categories=tiara
productsRouter.get("/search", async (req, res, next) => {
    try{
        let search = {}  
   
        const searchTerm = req.query.categories;

        if (searchTerm) {
         const regex = new RegExp(searchTerm, 'i'); // 'i' for case-insensitive matching

        search.$or = [
            { categories: { $in: [regex] } },
            { title: { $regex: regex } }
        ];
}

        const productList = await Product.find(search).populate("categories");

        if (!productList || productList.length === 0) {
            return res.status(204).json({ message: "Searched products not found" });
        } else {
            res.status(200).json(productList);
        }
    } catch (err) {
        // Pass the error to the next middleware
        return next(err);
    }
}, errorHandler);


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

//get one product by category
productsRouter.get("/filter/:categories", async (req, res, next) => {
    try {
        const { categories } = req.params;
        const response = await Product.find({ categories: { $in: [categories] } })
        if(!response){
            return next({statusCode: 404, message: `Product not found`})
        }

        if (!response || response.length === 0) {
            return next({ statusCode: 404, message: `Products not found for category: ${categories}` });
        }

        res.status(200).json(response) 
    } catch (err) {
        console.log(err)
        return next() }
}, errorHandler)

//change product data / ADMIN
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
        return next() 
    }
}, errorHandler)

//delete product by id / ADMIN
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
