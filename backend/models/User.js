
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },   
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },           
    profilePic: { type: String, default: "/images/robot.jpg" },
    bio: { type: String, default: "" },
    posts: [{ type: Number }],                            
    friends: [{ type: Number }],                          
    friendRequests: [{ type: Number }],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);