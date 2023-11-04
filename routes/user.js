import express from "express";
import User from "../models/User.js"
import Cart from "../models/Cart.js"
import Order from "../models/Order.js"
import bcrypt from "bcrypt";

const usersRouter = express.Router()

// const secret = process.env.SECRET;


//create a new user
usersRouter.post("/", async (req, res) => {
    try {

        const {firstName, lastName, birth, email, password} = req.body;
        //check if email already exists findOne
        const response = await User.create({firstName, lastName, birth, email, password})
        res.status(201).json(response) 
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Invalid entry"})
    }
})


//get all users
usersRouter.get("/", async (req, res) => {
    try {
        const response = await User.find()
        res.status(200).json(response) 
    } catch (error) {
        res.status(500).json({message: "Invalid entry"})
    }
})


//get one user by id
usersRouter.get("/:id", async (req, res) => {
    try {
        const response = await User.findOne({_id: req.params.id})
        res.status(200).json(response) 
    } catch (error) {
        res.status(500).json({message: "Invalid entry"})
    }
})

// update the user PASSWORD only 
// usersRouter.put("/:id", async (req, res) => {
//     try {
//         const {id} = req.params
//         const {firstName, lastName, birth, password} = req.body
//         const response = await User.findByIdAndUpdate(id, {firstName, lastName, birth, password}, {new:true})
        
//         if(!response){
//             res.status(404).json({message: "User not found"})
//         }
//         res.status(200).json(response) 
//     } catch (error) {
//         res.status(500).json({message: "Invalid entry"})
//     }
// })


usersRouter.put("/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const {firstName, lastName, birth, password} = req.body
  
      //  Hash the password before saving to DB
      const hashedPassword = await bcrypt.hash(password, 10);

      const response = await User.findByIdAndUpdate(id, { $set: { firstName, lastName, birth,
        password: hashedPassword}}, {new:true});
      res.status(201).json(response);
    } catch (error) {
      res.status(500).json({ message: "Invalid entry" });
    }
  });


//update the user PASSWORD only - ADMIN TEST
usersRouter.put("/password/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const {firstName, lastName, birth, password} = req.body
  
      //  Hash the password before saving to DB
      const hashedPassword = await bcrypt.hash(password, 10);

      const response = await User.findByIdAndUpdate(id, {firstName, lastName, birth}, { $set: {
        password: hashedPassword,
      }}, {new:true});
      res.status(201).json(response);
    } catch (error) {
      res.status(500).json({ message: "Invalid entry" });
    }
  });


// delete a user by ID
usersRouter.delete("/:id", async (req, res) => {
    try {
        const {id} = req.params
        const response = await User.findByIdAndDelete(id)

        if(!response){
           return res.status(404).json({message: "User not found"})
        }
        res.status(200).json({message: "User deleted successfully!"}) 
    } catch (error) {
        res.status(500).json({message: "Invalid entry"})
    }
})



//PUSH CART TO ORDERS

usersRouter.post("/processOrder/:userId", async (req, res) => {
    try {
        const {userId} = req.params
        const response = await Cart.findOne({userId: userId})
        // res.status(200).json({message: response}) 

        const pushOrder = await Order.create({
            userId, 
            products: response.products, 
            })

        res.status(201).json(pushOrder) 

    } catch (error) {
        res.status(500).json({message: "Invalid entry"})
    }
})

export default usersRouter
