
import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";

const router = express.Router();

// SIGN UP
router.post("/signup", async (req, res) => {
  try {
    const { username, password, bio, profilePic } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, error: "Username and password are required" });
    }

    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(409).json({ success: false, error: "Username already taken" });
    }

    const hashed = await bcrypt.hash(password, 10);

    // Auto-increment integer id
    const last = await User.findOne().sort({ id: -1 });
    const nextId = last ? last.id + 1 : 1;

    const user = await User.create({
      id: nextId,
      username,
      password: hashed,
      bio: bio || "",
      profilePic: profilePic || "/images/robot.jpg",
      posts: [],
      friends: [],
      friendRequests: [],
    });

    const { password: _pw, ...safe } = user.toObject();
    res.status(201).json({ success: true, user: safe });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// SIGN IN
router.post("/signin", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, error: "Username and password are required" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    const { password: _pw, ...safe } = user.toObject();
    res.json({ success: true, user: safe });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;