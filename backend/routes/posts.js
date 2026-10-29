import express from "express";
import Post from "../models/Post.js";
import User from "../models/User.js";
import Album from "../models/Album.js";
import Activity from "../models/Activity.js";
import { requireLogin } from "../middleware/auth.js";

const router = express.Router();

async function nextId(Model) {
  const last = await Model.findOne().sort({ id: -1 });
  return last ? last.id + 1 : 1;
}

router.get("/", async (req, res) => {
  const sort = req.query.sort === "comments" ? { "comments.length": -1 } : { createdAt: -1 };
  // simple fallback: fetch then sort in memory for comments
  let posts = await Post.find().sort({ createdAt: -1 });
  if (req.query.sort === "comments") {
    posts = posts.sort((a, b) => b.comments.length - a.comments.length);
  }
  const out = posts.map((p) => ({
    ...p.toObject(),
    reportCount: p.reports.length,
  }));
  res.json(out);
});

router.get("/feed/:username", async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  if (!user) return res.status(404).json({ error: "User not found" });
  const friends = await User.find({ id: { $in: user.friends } });
  const names = friends.map((f) => f.username).concat(user.username);
  const posts = await Post.find({ username: { $in: names } }).sort({ createdAt: -1 });
  res.json(posts.map((p) => ({ ...p.toObject(), reportCount: p.reports.length })));
});

router.get("/:id", async (req, res) => {
  const post = await Post.findOne({ id: Number(req.params.id) });
  if (!post) return res.status(404).json({ error: "Post not found" });
  res.json({ ...post.toObject(), reportCount: post.reports.length });
});

router.post("/", requireLogin, async (req, res) => {
  try {
    const { caption, image, hashtags } = req.body;
    const username = req.session.user.username;
    const id = await nextId(Post);
    const post = await Post.create({
      id, username, caption: caption || "", image: image || "",
      hashtags: hashtags || [], comments: [], reports: [], albums: [],
    });
    await User.updateOne({ username }, { $push: { posts: id } });
    await Activity.create({
      id: await nextId(Activity), username, type: "post_created",
      targetType: "post", targetId: id,
    });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", requireLogin, async (req, res) => {
  const post = await Post.findOne({ id: Number(req.params.id) });
  if (!post) return res.status(404).json({ error: "Post not found" });
  if (post.username !== req.session.user.username && req.session.user.role !== "admin") {
    return res.status(403).json({ error: "Not allowed" });
  }
  const { caption, hashtags } = req.body;
  if (caption !== undefined) post.caption = caption;
  if (hashtags !== undefined) post.hashtags = hashtags;
  await post.save();
  res.json(post);
});

router.delete("/:id", requireLogin, async (req, res) => {
  const id = Number(req.params.id);
  const post = await Post.findOne({ id });
  if (!post) return res.status(404).json({ error: "Post not found" });
  if (post.username !== req.session.user.username && req.session.user.role !== "admin") {
    return res.status(403).json({ error: "Not allowed" });
  }
  await Post.deleteOne({ id });
  await User.updateOne({ username: post.username }, { $pull: { posts: id } });
  await Album.updateMany({ posts: id }, { $pull: { posts: id } });
  res.json({ success: true });
});

router.post("/:id/comments", requireLogin, async (req, res) => {
  const post = await Post.findOne({ id: Number(req.params.id) });
  if (!post) return res.status(404).json({ error: "Post not found" });
  const { comment } = req.body;
  if (!comment) return res.status(400).json({ error: "comment required" });
  const nextCommentId = post.comments.length
    ? Math.max(...post.comments.map((c) => c.id)) + 1
    : 1;
  post.comments.push({ id: nextCommentId, commUname: req.session.user.username, comment });
  await post.save();
  await Activity.create({
    id: await nextId(Activity), username: req.session.user.username,
    type: "comment_added", targetType: "post", targetId: post.id,
  });
  res.status(201).json(post);
});

router.delete("/:id/comments/:commentId", requireLogin, async (req, res) => {
  const post = await Post.findOne({ id: Number(req.params.id) });
  if (!post) return res.status(404).json({ error: "Post not found" });
  const cid = Number(req.params.commentId);
  const comment = post.comments.find((c) => c.id === cid);
  if (!comment) return res.status(404).json({ error: "Comment not found" });
  if (comment.commUname !== req.session.user.username && req.session.user.role !== "admin") {
    return res.status(403).json({ error: "Not allowed" });
  }
  post.comments = post.comments.filter((c) => c.id !== cid);
  await post.save();
  res.json(post);
});

export default router;