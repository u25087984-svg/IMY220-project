import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Basic health check — confirms the server is alive
app.get("/", (req, res) => {
  res.json({ message: "Momentum backend is running" });
});

// Stubbed sign-in endpoint — returns dummy data, no real auth yet
app.post("/api/signin", (req, res) => {
  const { username, password } = req.body;

  res.json({
    success: true,
    user: {
      id: 1,
      username: username,
      bio: "This is a dummy bio.",
      profilePic: "src/assets/images/robot.jpg",
    },
  });
});

// Stubbed sign-up endpoint — returns dummy data, no real auth yet
app.post("/api/signup", (req, res) => {
  const { username, password } = req.body;

  res.json({
    success: true,
    user: {
      id: 99,
      username: username,
      bio: "",
      profilePic: "src/assets/images/robot.jpg",
    },
  });
});

app.listen(PORT, () => {
  console.log(`Momentum backend listening on port ${PORT}`);
});