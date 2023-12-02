import express from "express";
import User from "../models/User.js"
import Cart from "../models/Cart.js"
import Order from "../models/Order.js"
import bcrypt from "bcrypt";
import userAuth from "../middlewares/userAuth.js";
import adminAuth from "../middlewares/adminAuth.js";
import errorHandler from "../middlewares/errorHandler.js";

const usersRouter = express.Router()

// const secret = process.env.SECRET;


//create a new user
// usersRouter.post("/", async (req, res, next) => {
//     try {
//         const {firstName, lastName, birth, email, password} = req.body;
        
//         //check if email already exists findOne
//         const emailExist = await User.findOne({email})

//         if(emailExist){
//             return res.status(422).json({message: `Email: ${email} is already in use` })
//          }

//         const response = await User.create({firstName, lastName, birth, email, password})
//         res.status(201).json(response) 
//     } catch (error) {
//         next()
//     }
// }, errorHandler)



//get all users / ADMIN
usersRouter.get("/", async (req, res, next) => {
    try {
        const response = await User.find()

        if(!response){
            return next({statusCode: 404, message: `Users not found`})
        }

        res.status(200).json(response) 
    
    } catch (error) {
        return next()
    }
}, errorHandler)

usersRouter.get('/user', userAuth, async (req, res) => {
    try {
        const response = await User.findById(req.user.id)
        console.log(response, "response")

        if(!response){
            return res.status(404).json({ message: `User with id ${id} doesn't exist` })

        }

        res.status(200).json(response)

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: `User with id ${id} doesn't exist` })
    }
  });


// get one user by id
usersRouter.get("/:id", userAuth, async (req, res, next) => {
    try {
        const {id} = req.params
        const response = await User.findById(id)
        console.log(response, "response")

        if(!response){
            return next({statusCode: 404, message: `User with id ${id} doesn't exist`})
        }
        res.status(200).json(response)
        
    } catch (err) {
        res.status(500).json({message: "Invalid entry"})
        return next() 
    }}, errorHandler);

    
//change many or just one line
// usersRouter.put("/:id", userAuth, async (req, res, next) => {
usersRouter.put("/:id", async (req, res, next) => {

    const {id} = req.params;
    const {firstName, lastName, birth, password} = req.body;
    try {
        const updateFields = {};

        if (firstName !== undefined) {
            updateFields.firstName = firstName;
        }

        if (lastName !== undefined) {
            updateFields.lastName = lastName;
        }

        if (birth !== undefined) {
            updateFields.birth = birth;
        }

        if (password !== undefined) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateFields.password = hashedPassword;
        }
      
        const response = await User.findByIdAndUpdate(id, { $set: updateFields }, { new: true });

        if (!response) {
            return next({statusCode: 404, message: `User not found`})
            // res.status(404).json({ message: "User not found"  });
        }

        return res.status(201).json(response)
        } catch (err) {
            console.log(err);
            return next()
    }
}, errorHandler);

//Push users cart to order
// usersRouter.post("/reserve/:userId", userAuth, async (req, res, next) => {
    usersRouter.post("/reserve/:userId", async (req, res, next) => {

    try {
        const {userId} = req.params
        const response = await Cart.findOne({userId: userId})

        if(!response){
            return next({statusCode: 404, message: `Cart not available`})
        }

        const pushOrder = await Order.create({
            userId, 
            products: response.products, 
            totalAmount: response.totalAmount,
            totalAmountPrice: response.totalAmountPrice
            })

        res.status(201).json(pushOrder) 

    } catch (error) {
       return next()
    }
}, errorHandler)

export default usersRouter
