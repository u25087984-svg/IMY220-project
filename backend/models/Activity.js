import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    username: { type: String, required: true },
    type: {
      type: String,
      enum: ["post_created", "album_created", "photos_added", "comment_added"],
      required: true,
    },
    targetType: { type: String }, // "post" | "album"
    targetId: { type: Number },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export default mongoose.model("Activity", activitySchema);