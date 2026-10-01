
import express from "express";
import Post from "../models/Post.js";
import User from "../models/User.js";

const router = express.Router();

// GET global feed
router.get("/", async (_req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });
  res.json(posts);
});

// GET local feed 
router.get("/feed/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ error: "User not found" });

    const friendIds = user.friends;                       // integers
    const friends = await User.find({ id: { $in: friendIds } });
    const friendNames = friends.map((f) => f.username);

    const posts = await Post.find({
      username: { $in: [...friendNames, user.username] },
    }).sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET one post
router.get("/:id", async (req, res) => {
  const post = await Post.findOne({ id: Number(req.params.id) });
  if (!post) return res.status(404).json({ error: "Post not found" });
  res.json(post);
});

// CREATE post
router.post("/", async (req, res) => {
  try {
    const { username, caption, image, hashtags } = req.body;
    if (!username) return res.status(400).json({ error: "username required" });

    const last = await Post.findOne().sort({ id: -1 });
    const nextId = last ? last.id + 1 : 1;

    const post = await Post.create({
      id: nextId,
      username,
      caption: caption || "",
      image: image || "",
      hashtags: hashtags || [],
      comments: [],
    });

    // Also register it on the owner's user doc
    await User.updateOne({ username }, { $push: { posts: nextId } });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE post 
router.put("/:id", async (req, res) => {
  try {
    const { caption, hashtags } = req.body;
    const post = await Post.findOneAndUpdate(
      { id: Number(req.params.id) },
      { $set: { caption, hashtags } },
      { new: true }
    );
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE post
router.delete("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const deleted = await Post.findOneAndDelete({ id });
  if (!deleted) return res.status(404).json({ error: "Post not found" });

  await User.updateOne({ username: deleted.username }, { $pull: { posts: id } });
  res.json({ success: true, deleted });
});

// ADD comment
router.post("/:id/comments", async (req, res) => {
  try {
    const { commUname, comment } = req.body;
    const post = await Post.findOne({ id: Number(req.params.id) });
    if (!post) return res.status(404).json({ error: "Post not found" });

    const lastCommentId = post.comments.length
      ? Math.max(...post.comments.map((c) => c.id))
      : 0;

    post.comments.push({
      id: lastCommentId + 1,
      commUname,
      comment,
    });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE comment
router.delete("/:id/comments/:commentId", async (req, res) => {
  const post = await Post.findOne({ id: Number(req.params.id) });
  if (!post) return res.status(404).json({ error: "Post not found" });

  post.comments = post.comments.filter(
    (c) => c.id !== Number(req.params.commentId)
  );
  await post.save();
  res.json(post);
});

// REPORT post
router.post("/:id/report", async (req, res) => {
  const post = await Post.findOneAndUpdate(
    { id: Number(req.params.id) },
    { $inc: { reports: 1 } },
    { new: true }
  );
  if (!post) return res.status(404).json({ error: "Post not found" });
  res.json({ success: true, reports: post.reports });
});

export default router;