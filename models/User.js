import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      birth: { type: Date, required: true},
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      isAdmin: {type: Boolean, default: false},
      newsletter: { type: Boolean, default: false},
    },
    { timestamps: true }
  );

const User = mongoose.model("User", UserSchema)

export default User
  

// birth: { type: Date, required: true, min: '1950-01-01', max: '2024-01-01'},
