import express, { request } from "express";
import Cart from "../models/Cart.js"
import Product from "../models/Product.js"

import errorHandler from "../middlewares/errorHandler.js";


const cartRouter = express.Router()
const secret = process.env.SECRET;

//create a new cart
cartRouter.post("/", async (req, res, next) => {
    try {
        const response = await Cart.create(req.body)

 // Now calculate the totalAmount
 let totalAmount = 0;
 let totalAmountPrice = 0;

 for (const item of response.products) {
     const product = await Product.findById(item.productId);
     if (product) {
         totalAmount += item.quantity;
         totalAmountPrice += item.quantity * product.price
     }
 }

 // Update the cart again with the new totalAmount
 response.totalAmount = totalAmount;
 response.totalAmountPrice = totalAmountPrice;
 await response.save();

        res.status(201).json(response) 
    } catch (error) {
        return next()
    }
}, errorHandler)


//get all carts / ADMIN
cartRouter.get("/", async (req, res, next) => {
    try {
        const response = await Cart.find().populate('userId').populate('products.productId')
  

        res.status(200).json(response) 
    } catch (error) {
        return next()
    }
}, errorHandler)


//get one cart by cartId
cartRouter.get("/:id", async (req, res, next) => {
    try {
        const response = await Cart.findById(req.params.id).populate('userId')

        if(!response){
            return next({statusCode: 404, message: `Cart not found`})
        }
        res.status(200).json(response) 
    } catch (error) {
        return next()
    }
},errorHandler)

//get one cart by userId
cartRouter.get("/user/:userId", async (req, res, next) => {
    try {
        const response = await Cart.findOne({userId: req.params.userId}).populate('userId').populate('products.productId')
        //const response = null;
        if(!response){
            return next({statusCode: 404, message: `This user has no cart`})
        }
        
        res.status(200).json(response) 
    } catch (error) {
        return next()
    }
}, errorHandler)


//update quantity of product

cartRouter.put("/user/:userId/:productId", async (req, res, next) => {
  try {
    const { userId, productId } = req.params;
    const newQuantity = parseInt(req.body.newQuantity, 10);

    // Find the cart
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    // Find the product in the cart and update its quantity
    const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);

    if (productIndex !== -1) {
      // Update quantity if product exists
      cart.products[productIndex].quantity = newQuantity;
    } else {
      // Add new product if it doesn't exist
      cart.products.push({ productId, quantity: newQuantity });
    }

    // Recalculate total amount and total amount price
    let totalAmount = 0;
    let totalAmountPrice = 0;
    for (const item of cart.products) {
      totalAmount += item.quantity;

      // Fetch product price from the product collection
      const productDetails = await Product.findById(item.productId);
      if (productDetails) {
        totalAmountPrice += item.quantity * productDetails.price;
      }
    }

    cart.totalAmount = totalAmount;
    cart.totalAmountPrice = totalAmountPrice;

    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: 'Cart updated successfully', cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}, errorHandler);

// delete entire line of product from the CART
cartRouter.put("/user/:userId/remove/:productId", async (req, res, next) => {
  try {
    const { userId, productId } = req.params;

    // Find the cart and remove the product
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found in cart' });
    }
    
    // Remove the product from the cart
    cart.products.splice(productIndex, 1);

    // Recalculate total amount and total amount price
    let totalAmount = 0;
    let totalAmountPrice = 0;
    for (const item of cart.products) {
      totalAmount += item.quantity;

      // Fetch product price from the product collection
      const productDetails = await Product.findById(item.productId);
      if (productDetails) {
        totalAmountPrice += item.quantity * productDetails.price;
      }
    }

    cart.totalAmount = totalAmount;
    cart.totalAmountPrice = totalAmountPrice;

    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: 'Product removed successfully', cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}, errorHandler);



// delete cart 
cartRouter.delete("/:id", async (req, res, next) => {
    try {
        const {id} = req.params
        const response = await Cart.findByIdAndDelete(id)
        if(!response){
            return next({statusCode: 404, message: `Cart not found`})
        }
        res.status(200).json({message: "Cart deleted successfully!"}) 
    } catch (error) {
        return next()
    }
},errorHandler)


// cartRouter.delete("/user/:userId", async (req, res, next) => {
//   try {
//       // const {userId} = req.params
//       const response = await Cart.findOneAndDelete({userId: req.params.userId})
//       if(!response){
//           return next({statusCode: 404, message: `Cart not found`})
//       }
//       res.status(200).json({message: "Cart deleted successfully!"}) 
//   } catch (error) {
//       return next()
//   }
// },errorHandler)

export default cartRouter
