import express from "express"
import "dotenv/config"
import client from "./db/db.js"
import cors from "cors"
import usersRouter from "./routes/user.js"
import productsRouter from "./routes/product.js"
import ordersRouter from "./routes/order.js"
import cartRouter from "./routes/cart.js"
import authRouter from "./routes/auth.js"


// import authRouter from "./routes/auth.js"

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}));

app.use(cors({
    origin: "http://localhost:5173",

    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Access-Control-Allow-Origin", "Access-Control-Allow-Credentials"],
    credentials: true,
  }))


  app.get("/api/welcome"), (req, res) => {
    res.status(200).send({message: "Welcome to The Jewellery Shop API!"})
  }

app.use("/api/users", usersRouter)
app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/cart", cartRouter);
app.use("/api/auth", authRouter)

const port = 3000 || process.env.PORT



client.on("connected", () => {
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`)
    })
    app.listen(80, function () {
        console.log('CORS-enabled web server listening on port 80')
      })
})

