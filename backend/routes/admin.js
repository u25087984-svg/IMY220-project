import express from "express";
import User from "../models/User.js";
import Post from "../models/Post.js";
import Album from "../models/Album.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// list users
router.get("/users", requireAdmin, async (_req, res) => {
  const users = await User.find().select("-password").sort({ id: 1 });
  res.json(users);
});

// delete any user (cascade)
router.delete("/users/:username", requireAdmin, async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  if (!user) return res.status(404).json({ error: "User not found" });
  await Post.deleteMany({ username: user.username });
  await Album.deleteMany({ username: user.username });
  await User.updateMany({}, {
    $pull: { friends: user.id, friendRequests: user.id, sentRequests: user.id },
  });
  await User.deleteOne({ id: user.id });
  res.json({ success: true });
});

// list posts
router.get("/posts", requireAdmin, async (_req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});

// delete any post
router.delete("/posts/:id", requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  await Post.deleteOne({ id });
  await User.updateMany({}, { $pull: { posts: id } });
  await Album.updateMany({ posts: id }, { $pull: { posts: id } });
  res.json({ success: true });
});

export default router;