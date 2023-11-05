
import jwt from "jsonwebtoken";
const secret = process.env.SECRET;



  // const adminAuth = (req, res, next) => {
  //   req.user = user;

  //     if (user.isAdmin === true) {
  //       next();
  //     } else {
  //       res.status(403).json("You are not allowed to do that!");
  //     }
  //   ;
  // };
  
  const adminAuth = (req, res, next) => {
    // const token = req.headers.authorization;
    const {isAdmin} = req.user
    const {token} = req.body

    if (isAdmin === "true") {
    } else {
      res.status(403).json("You are not allowed to do that!");
    }
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




export default adminAuth



