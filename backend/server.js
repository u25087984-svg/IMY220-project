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

// Auth endpoints will be stubbed here in Part 5:
// app.post("/api/signin", ...)
// app.post("/api/signup", ...)

app.listen(PORT, () => {
  console.log(`Momentum backend listening on port ${PORT}`);
});
