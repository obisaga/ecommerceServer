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
        const emailExist = await User.findOne({email})

        if(emailExist){
            return res.status(422).json({message: `Email: ${email} is already in use` })
         }

        const response = await User.create({firstName, lastName, birth, email, password})
        res.status(201).json(response) 
    } catch (error) {
        res.status(500).json({message: "Invalid entry"})
    }
})


//get all users
usersRouter.get("/", async (req, res) => {
    try {
        const response = await User.find()

        if(!response){
            return res.status(404).json({ message: `Users not found` })
        }

        res.status(200).json(response) 
    } catch (error) {
        res.status(500).json({message: "Invalid entry"})
    }
})


// get one user by id
usersRouter.get("/:id", async (req, res) => {
    try {
        const {id} = req.params
        const response = await User.findById(id)
        console.log(response)

        if(!response){
            return res.status(404).json({ message: `User with id ${id} doesn't exist` })
        }

        res.status(200).json(response)
        
    } catch (error) {
        res.status(500).json({message: "Invalid entry."})
    }
    })

// usersRouter.put("/:id", async (req, res) => {
// use    try {
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
    const {id} = req.params;
    const {firstName, lastName, birth, password} = req.body;
    try {
        // const getData = await User.findById(id)

        const hashedPassword = await bcrypt.hash(password, 10);
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
            updateFields.password = hashedPassword;
        }
      
        const response = await User.findByIdAndUpdate(id, { $set: updateFields }, { new: true });

        if (!response) {
            res.status(404).json({ message: "User not found"  });
        }

        return res.status(201).json(response)
        } catch (err) {
            res.status(500).json({ message: "Invalid entry" })
    }
});

// usersRouter.put("/:id", async (req, res) => {
//     try {
//         const {id} = req.params;
//         const {firstName, lastName, birth, password} = req.body;
//       //  Hash the password before saving to DB
//       const hashedPassword = await bcrypt.hash(password, 10);
    
//     const response = await User.findByIdAndUpdate(
//         id, 
//         {firstName, 
//         lastName, 
//         birth,
//         password: hashedPassword},
//         {new:true});

//       if(!response){
//         return res.status(404).json({ message: "User not found" });
//       } else {
//         return res.status(201).json(response);
//       }

//     //   res.status(201).json(response);
//     } catch (error) {
//       res.status(500).json({ message: "Invalid entry" });
//     }
//   });

usersRouter.post("/processOrder/:userId", async (req, res) => {
    try {
        const {userId} = req.params
        const response = await Cart.findOne({userId: userId})

        if(!response){
            return res.status(404).json({message: "Cart not available"})
        }

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
