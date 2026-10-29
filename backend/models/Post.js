import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    commUname: { type: String, required: true },
    comment: { type: String, required: true },
  },
  { _id: false }
);

const reportSchema = new mongoose.Schema(
  {
    reporter: { type: String, required: true }, 
    reasonId: { type: Number, required: true },
    reason: { type: String, required: true },
    date: { type: Date, default: Date.now },
  },
  { _id: false }
);

const postSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    username: { type: String, required: true },
    caption: { type: String, default: "" },
    image: { type: String, default: "" },
    hashtags: [{ type: String }],
    likes: { type: Number, default: 0 },
    comments: [commentSchema],
    reports: [reportSchema],
    albums: [{ type: Number }], 
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);