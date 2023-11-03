import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
    {
        title: { type: String, required: true},
        description: { type: String, required: true },
        image: { type: String, required: true },
        categories: [{ type: String }],
        size: { type: Number, required: true },
        amount: { type: Number, required: true },
        color: { type: String },
        price: { type: Number, required: true }
    },
    { timestamps: true }
);


// const ProductSchema = new mongoose.Schema(
//     {
//         title: { type: String, required: true},
//         description: { type: String, required: true },
//         image: { type: String, required: true },
//         categories: [{ type: String }],
//         availability: [ {size: { type: Number }}, {amount: { type: Number }}],

//         size: { type: Number, required: true },
//         amount: { type: Number, required: true },
//         color: { type: String },
//         price: { type: Number, required: true }
//     },
//     { timestamps: true }
// );


const Product = mongoose.model("Product", ProductSchema)

export default Product