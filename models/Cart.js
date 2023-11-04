import mongoose from "mongoose";

const CartSchema = new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }, 
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ]
    },{ timestamps: true }
  );


const Cart = mongoose.model("Cart", CartSchema)

export default Cart

