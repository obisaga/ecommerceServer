import express from "express";
import User from "../models/User.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import errorHandler from "../middlewares/errorHandler.js";

const authRouter = express.Router();

const secret = process.env.SECRET;



authRouter.post("/register", async (req, res, next) => {
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
    next()
  }
}, errorHandler);




const generateToken = (data) => {
  return jwt.sign(data, secret, { expiresIn: "180000s" });
};


authRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //check if the user exists in db
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials for email" });
    }

    //Compare passwords
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid credentials for password" });
    }
    

    // generate token
    const token = generateToken({ email: user.email });
    console.log(token)
    res.set("token", token);
    res.set("Access-Control-Expose-Headers", "token");

    res.status(200).json({token: token, message: "Login Successfull"}) 
  } catch (error) {
    next()
  }
}, errorHandler);

export default authRouter;