import express from "express";
import User from "../models/User.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const authRouter = express.Router();

const secret = process.env.SECRET;

// const generateToken = (data) => {
//   return jwt.sign(data, secret, { expiresIn: "1800s" });
// };

authRouter.post("/register", async (req, res) => {
  try {
   
    const {firstName, lastName, birth, email, password} = req.body;
  
    //check if the user exists in the database
    const userExists = await User.findOne(req.body);
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    //  Hash the password before saving to DB
    const hashedPassword = await bcrypt.hash(password, 10);
    const response = await User.create({
      firstName,
      lastName,
      birth,
      email,
      password: hashedPassword,
    });
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ message: "Invalid entry" });
  }
});




// authRouter.post("/login", async (req, res) => {
//   try {
//     console.log(req.body);
//     const { email, password } = req.body;

//     //check if the user exists in db
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     //Compare passwords
//     const validPassword = await bcrypt.compare(password, user.password);
//     if (!validPassword) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     //generate token
//     const token = generateToken({ email: user.email });

//     res.set("token", token);
//     res.set("Access-Control-Expose-Headers", "token");

//     res.json({ token });
//   } catch (error) {
//     res.status(401).json({ message: "Invalid credentials" });
//   }
// });

export default authRouter;



