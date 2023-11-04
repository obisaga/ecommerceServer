import mongoose from "mongoose";

mongoose.connect(process.env.MONGO_DB, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
})
.then(() => {
    console.log("Database connected successfully")
})
.catch((error) => console.log(error.message))

const client = mongoose.connection

client.on("error", (error) => console.log(error.message))

export default client