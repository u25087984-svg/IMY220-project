import express from "express";
import User from "../models/User.js";
import Post from "../models/Post.js";
import Album from "../models/Album.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const q = (req.query.q || "").trim();
  if (!q) return res.json({ users: [], posts: [], albums: [] });
  const rx = new RegExp(q, "i");

  const [users, posts, albums] = await Promise.all([
    User.find({
      $or: [{ username: rx }, { name: rx }, { email: rx }],
    }).select("-password").limit(20),
    Post.find({
      $or: [{ caption: rx }, { hashtags: rx }],
    }).limit(20),
    Album.find({
      $or: [{ name: rx }, { description: rx }, { hashtags: rx }],
    }).limit(20),
  ]);

  res.json({ users, posts, albums });
});

export default router;