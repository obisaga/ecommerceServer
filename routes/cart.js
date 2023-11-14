import express from "express";
import Cart from "../models/Cart.js"
import errorHandler from "../middlewares/errorHandler.js";


const cartRouter = express.Router()
const secret = process.env.SECRET;


//create a new cart
cartRouter.post("/", async (req, res, next) => {
    try {
        const response = await Cart.create(req.body)
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

//get one cart by userIdnpm 
cartRouter.get("/user/:userId", async (req, res, next) => {
    try {
        // const response = await Cart.find({userId: req.params.userId}).populate('userId')
        const response = await Cart.find({userId: req.params.userId}).populate('userId').populate('products.productId')
        if(!response){
            return next({statusCode: 404, message: `This user has no cart`})
        } else if (!response.length) {
            return next({statusCode: 204, message: `This user has no cart`})
        }
        
        res.status(200).json(response) 
    } catch (error) {
        return next()
    }
}, errorHandler)

// update cart by CART ID
cartRouter.put("/:id", async (req, res,next) => {
    try {
        const {id} = req.params
        const response = await Cart.findByIdAndUpdate(id, req.body, {new:true})
        if(!response){
            return next({statusCode: 404, message: `Cart not found`})
        }
        res.status(200).json({message: "Cart updated successfully!"}) 
    } catch (error) {
        return next()
    }
}, errorHandler)


// update cart by USERS ID
cartRouter.put("/user/:id", async (req, res, next) => {
    try {
        const {id} = req.params
        const response = await Cart.findOneAndUpdate({userId:id}, req.body, {new:true})
        //if quantity is 0 dont update but find product and delete it from the cart
        if(!response){
            return next({statusCode: 404, message: `Cart not found`})
        }
        res.status(200).json({message: "Cart updated successfully!"}) 
    } catch (error) {
        return next()
    }
}, errorHandler)

cartRouter.put("/user/:userId/:productId", async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const productId = req.params.productId;
        const newQuantity = req.body.newQuantity; // Assuming the new quantity is sent in the request body
    console.log(userId)
    console.log(productId)
    
    // Update the document in the database
        const result = await Cart.updateOne(
          {
            "userId": userId,
            "products.productId": productId
          },
          {
            $set: {
              "products.$[product].quantity": newQuantity
            }
          }
          ,
          {
            arrayFilters: [
              { "product.productId": productId }
            ]
          }, {new:true}
        );
    console.log(result) 
        // Check if the document was found and updated
        if (result.modifiedCount === 1) {
          return res.json({ message: 'Quantity updated successfully' });
        } else {
          return res.status(404).json({ error: 'Quantity could not be updated' });
        }
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    }, errorHandler);


    // delete one product from the CART
    cartRouter.put("/user/:userId/remove/:productId", async (req, res, next) => {
        try {
            const userId = req.params.userId;
            const productId = req.params.productId;
        console.log(userId)
        console.log(productId)
        
        // Update the document in the database
            const result = await Cart.updateOne(
              {
                "userId": userId,
                "products.productId": productId
              },
              {
                $pull: {
                    "products": { "productId": productId }
                 
                }
              }
              ,
              {
                arrayFilters: [
                  { "product.productId": productId }
                ]
              }, {new:true}
            );
        console.log(result) 
            // Check if the document was found and updated
            if (result.modifiedCount === 1) {
              return res.json({ message: 'Product removed successfully' });
            } else {
              return res.status(404).json({ error: 'Product could not be removed' });
            }
          } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
          }
        }, errorHandler);





    
// cartRouter.put("/user/:id/:productId", async (req, res, next) => {
//     try {
//         const {id} = req.params
//         const response = await Cart.findOneAndUpdate({userId:id}, req.body, {new:true})
//         if(!response){
//             return next({statusCode: 404, message: `Cart not found`})
//         }
//         res.status(200).json({message: "Cart updated successfully!"}) 
//     } catch (error) {
//         return next()
//     }
// }, errorHandler)


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


export default cartRouter
