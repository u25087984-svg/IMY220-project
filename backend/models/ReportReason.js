import mongoose from "mongoose";

const reasonSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true },
    label: { type: String, required: true },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("ReportReason", reasonSchema);