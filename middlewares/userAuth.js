import jwt from "jsonwebtoken";

const secret = process.env.SECRET;

const userAuth = (req, res, next) => {
    const token = req.headers.authorization;
    // const token = req.body.token;
    console.log(token);
    if (!token) {
      return res.sendStatus(401);
    }
  
    // const tokenData = token.split(' ')[1];
    // jwt.verify(tokenData, secret, (err, user) => {

    jwt.verify(token, secret, (err, user) => {
      if (err) {
        return res.sendStatus(401);
      }
      req.user = user;
      console.log(user)
      next();
    });
  };




export default userAuth