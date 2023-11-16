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

 for (const item of response.products) {
     const product = await Product.findById(item.productId);
     if (product) {
         // totalAmount += item.quantity * product.price;
         totalAmount += item.quantity;
     }
 }

 // Update the cart again with the new totalAmount
 response.totalAmount = totalAmount;
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




///UPDATING TOTAL AMOUNT
// cartRouter.put("/:id", async (req, res, next) => {
//   try {
//       const { id } = req.params;

//       // First update the cart with the provided data
//       let cart = await Cart.findByIdAndUpdate(id, req.body, { new: true });

//       if (!cart) {
//           return next({ statusCode: 404, message: "Cart not found" });
//       }

//       // Now calculate the totalAmount
//       let totalAmount = 0;

//       for (const item of cart.products) {
//           const product = await Product.findById(item.productId);
//           if (product) {
//               // totalAmount += item.quantity * product.price;
//               totalAmount += item.quantity;
//           }
//       }

//       // Update the cart again with the new totalAmount
//       cart.totalAmount = totalAmount;
//       await cart.save();

//       res.status(200).json({ message: "Cart updated successfully!", cart }); 
//   } catch (error) {
//       return next({ statusCode: 500, message: "Internal Server Error" });
//   }
// }, errorHandler);



// update cart by USERS ID
cartRouter.put("/user/:id", async (req, res, next) => {
    try {
        const {id} = req.params
        const response = await Cart.findOneAndUpdate({userId:id}, req.body, {new:true})


        if(!response){
            return next({statusCode: 404, message: `Cart not found`})
           }
// // Check if the product already exists in the cart
// const requestProducts = req.body.products.map((request) => request.productId._id);

// for (const requestProductId of requestProducts) {
//     const existingProductIndex = response.products.findIndex(
//         (item) => item.productId === requestProductId
//     );

//     if (existingProductIndex !== -1) {
//         // Product already exists in the cart, update the quantity
//         response.products[existingProductIndex].quantity += 1;
//     } else {
//         // Product is not in the cart, add it
//         response.products.push({
//             productId: requestProductId,
//             quantity: 1,
//         });
//     }
// }

       console.log("RESPONSE", response)

   console.log("REQUEST BODY", req.body)
      // console.log(req.body.products.map((request)=> request.productId._id))
      //  const requestF = req.body.products.map((request)=> request.productId._id)
      //  console.log(requestF, "Frontend Request map")
     

          //  const existingProducts =  response.products.find((item) => item.productId === requestF.includes(item.productId))
          //  if(existingProducts){
          //    return next (console.log("product is already in cart"))}
          //    else {
          //     console.log("product is not in cart")
          //    }
        


       // Now calculate the totalAmount
      let totalAmount = 0;

      for (const item of response.products) {
          const product = await Product.findById(item.productId);
          if (product) {
              // totalAmount += item.quantity * product.price;
              totalAmount += item.quantity;
          }
      }

      // Update the cart again with the new totalAmount
      response.totalAmount = totalAmount;
      await response.save();

        res.status(200).json({message: "Cart updated successfully!"}) 
    } catch (error) {
        return next()
    }
}, errorHandler)





//update quantity of product

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
