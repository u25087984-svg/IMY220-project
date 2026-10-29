import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true }, 
    name: { type: String, default: "" },
    pronouns: { type: String, default: "" },
    bio: { type: String, default: "" },
    profilePic: { type: String, default: "/images/robot.jpg" },
    socialLinks: {
      instagram: { type: String, default: "" },
      twitter: { type: String, default: "" },
      website: { type: String, default: "" },
    },
    posts: [{ type: Number }],
    friends: [{ type: Number }],           
    friendRequests: [{ type: Number }],    
    sentRequests: [{ type: Number }],      
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);