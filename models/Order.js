import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
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
    ],
    totalAmount: { type: Number},
    address: { type: Object},
    status: {type: String, default:"Pending"}
  
    },
    { timestamps: true }
  );

const Order = mongoose.model("Order", OrderSchema)

export default Order



