import express from "express";
import Activity from "../models/Activity.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  const acts = await Activity.find().sort({ createdAt: -1 }).limit(100);
  res.json(acts);
});

router.get("/feed/:username", async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  if (!user) return res.status(404).json({ error: "User not found" });
  const friends = await User.find({ id: { $in: user.friends } });
  const names = friends.map((f) => f.username).concat(user.username);
  const acts = await Activity.find({ username: { $in: names } })
    .sort({ createdAt: -1 }).limit(100);
  res.json(acts);
});

export default router;