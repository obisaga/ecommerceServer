import mongoose from "mongoose";


const ProductSchema = new mongoose.Schema(
    {
        title: { type: String, required: true},
        description: { type: String, required: true },
        image: { type: String},
        categories: [{ type: String }],
        availability: [
            {
                size: { type: Number, required: true },
                
                amount: { type: Number, required: true }
            }
        ],
        color: { type: String },
        price: { type: Number, required: true }
    },
    { timestamps: true }
);


const Product = mongoose.model("Product", ProductSchema)

export default Product