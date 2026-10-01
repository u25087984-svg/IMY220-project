
import express from "express";
import User from "../models/User.js";

const router = express.Router();

// GET all users
router.get("/", async (_req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

// GET profile by username
router.get("/:username", async (req, res) => {
  const user = await User.findOne({ username: req.params.username }).select("-password");
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

// EDIT own profile
router.put("/:username", async (req, res) => {
  try {
    const { bio, profilePic } = req.body;
    const user = await User.findOneAndUpdate(
      { username: req.params.username },
      { $set: { bio, profilePic } },
      { new: true }
    ).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// SEND friend request 
router.post("/:from/friend-request/:to", async (req, res) => {
  const { from, to } = req.params;
  const target = await User.findOne({ username: to });
  if (!target) return res.status(404).json({ error: "Target user not found" });

  const sender = await User.findOne({ username: from });
  if (!sender) return res.status(404).json({ error: "Sender not found" });

  if (target.friendRequests.includes(sender.id) || target.friends.includes(sender.id)) {
    return res.status(409).json({ error: "Request already sent or already friends" });
  }

  target.friendRequests.push(sender.id);
  await target.save();
  res.json({ success: true, target });
});

// ACCEPT friend request
router.post("/:username/accept/:requesterId", async (req, res) => {
  const { username, requesterId } = req.params;
  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ error: "User not found" });

  const reqId = Number(requesterId);
  if (!user.friendRequests.includes(reqId)) {
    return res.status(404).json({ error: "No such request" });
  }

  user.friendRequests = user.friendRequests.filter((id) => id !== reqId);
  user.friends.push(reqId);
  await user.save();

  const other = await User.findOne({ id: reqId });
  if (other && !other.friends.includes(user.id)) {
    other.friends.push(user.id);
    await other.save();
  }

  res.json({ success: true, user });
});

// UNFRIEND
router.post("/:username/unfriend/:friendId", async (req, res) => {
  const { username, friendId } = req.params;
  const user = await User.findOne({ username });
  const fid = Number(friendId);

  user.friends = user.friends.filter((id) => id !== fid);
  await user.save();

  const other = await User.findOne({ id: fid });
  if (other) {
    other.friends = other.friends.filter((id) => id !== user.id);
    await other.save();
  }

  res.json({ success: true, user });
});

export default router;