
import mongoose from "mongoose";

const albumSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    username: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, default: "" },
    hashtags: [{ type: String }],
    posts: [{ type: Number }],   // post ids
  },
  { timestamps: true }
);

export default mongoose.model("Album", albumSchema);