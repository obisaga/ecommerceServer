import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
      firstName: { 
        type: String, 
        trim: true,
        required: true },
      lastName: { 
        type: String, 
        trim: true,
        required: true },
      birth: { 
        type: Date, 
        required: true},
      email: {
        type: String,
        required: [true, "Email required"],
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
      password: { 
        type: String, 
        required: true, 
        trim: true,
        minlength: 3,
        maxlength: 30
    },
      isAdmin: {
        type: Boolean, 
        default: false},
      newsletter: { 
        type: Boolean, 
        default: false},
    },
    { timestamps: true }
  );

const User = mongoose.model("User", UserSchema)

export default User
  


