import jwt from "jsonwebtoken";


const authJwt = () => {
  const secret = process.env.SECRET;

  return jwt.sign({
    secretOrPrivateKey: secret,
    algorithms: ["HS256"],
    isRevoked: isRevoked
  }).unless({
    path: [
      {url: /\/api\/products(.*)/, methods: ["GET", "OPTIONS"]},
      {url: /\/api\/users(.*)/, methods: ["POST", "GET", "OPTIONS"]}
    ]
  })
}

const isRevoked = (req, payload, done) => {
  if(!payload.isAdmin) {
    done(null, true)
  }
  done()
}


// const generateToken = (data) => {
//   return jwt.sign(data, secret, { expiresIn: "1800s" });
// };

// const verifyToken = (req, res, next) => {
//     const authHeader = req.headers.token;
//     if (authHeader) {
//       const token = authHeader.split(" ")[1];
//       jwt.verify(token, process.env.SECRET, (err, user) => {
//         if (err) res.status(403).json("Token is not valid!");
//         req.user = user;
//         next();
//       });
//     } else {
//       return res.status(401).json("You are not authenticated!");
//     }
//   };

// const verifyTokenAndAdmin = (req, res, next) => {
//     verifyToken(req, res, () => {
//       if (req.user.isAdmin) {
//         next();
//       } else {
//         res.status(403).json("You are not alowed to do that!");
//       }
//     });
//   };

//   const admin = (req, res, next) => {
//     verifyToken(req, res, () => {
//       if (req.user.id === req.params.id || req.user.isAdmin) {
//         next();
//       } else {
//         res.status(403).json("You are not alowed to do that!");
//       }
//     });
//   };


  export default authJwt;