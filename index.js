import express from "express"
import "dotenv/config"
import client from "./db/db.js"
import cors from "cors"
import usersRouter from "./routes/user.js"
import productsRouter from "./routes/product.js"
import ordersRouter from "./routes/order.js"
import cartRouter from "./routes/cart.js"
import authRouter from "./routes/auth.js"
// import authJwt from "./routes/verifyToken.js"

const app = express()

app.use(express.json())
// app.use(authJwt());
app.use(express.urlencoded({extended: true}));

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Access-Control-Allow-Origin", "Access-Control-Allow-Credentials"],
    credentials: true,
  }))

app.use("/api/users", usersRouter)
app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/cart", cartRouter);
app.use("/api/auth", authRouter)

const port = 3000 || process.env.port


client.on("connected", () => {
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`)
    })
    app.listen(80, function () {
        console.log('CORS-enabled web server listening on port 80')
      })
})