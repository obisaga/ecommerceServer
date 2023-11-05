
// import express from "express";

import jwt from "jsonwebtoken";

// const authRouter = express.Router();
const secret = process.env.SECRET;

const tokenAuth = (req, res, next) => {
    // const token = req.headers.authorization;
    const token = req.body.token;

    // console.log(token);
  
    if (!token) {
      return res.sendStatus(401);
    }
  
    jwt.verify(token, secret, (err, user) => {
      if (err) {
        return res.sendStatus(401);
      }
      req.user = user;
      next();
    });
  };




export default tokenAuth