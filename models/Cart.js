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
    ],
    totalAmount: {
      type: Number,
      default: 0,
    },
    },{ timestamps: true }
  );

  // CartSchema.pre('save', async function (next) {
  //   try { 
      
  //     let totalQuantity = 0;
  
  //     // for (const products of this.products) {
  //       for (const products of this.product.map((product) => product.quantity)) {


  //       let totalQuantity = products.reduce((accumulator, object) => {return accumulator + object;}, 0);
  //       }

  //     this.totalAmount = totalQuantity;
  //     next();
      
  // }

          
  //  catch (error) {
  //     next(error);
  //   }
  // });
  

const Cart = mongoose.model("Cart", CartSchema)

export default Cart

// import mongoose from "mongoose";

// const CartSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User'
//     }, 
//     products: [
//       {
//         productId: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: 'Product'
//         },
//         quantity: {
//           type: Number,
//           default: 1,
//         },
//       },
//     ],
//     totalAmount: {
//       type: Number,
//       default: 0,
//     },
//   },
//   { timestamps: true }
// );

// // Calculate and update totalAmount before saving the cart
// CartSchema.pre('save', async function (next) {
//   try {
//     let totalQuantity = 0;

//     for (const product of this.products) {
//       totalQuantity += product.quantity;
//     }

//     this.totalAmount = totalQuantity;
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

// const Cart = mongoose.model("Cart", CartSchema);

// export default Cart;