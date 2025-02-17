const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors"); // Import CORS
const path = require("path");

const authRouter = require("./routes/auth");
const quizRouter = require("./routes/quiz");
const userRouter = require("./routes/user");
const adminRouter = require("./routes/admin");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ CORS Configuration: Allow both Localhost and Deployed Frontend
app.use(
  cors({
    origin: "deploying-full-stack-sigma.vercel.app",
    credentials: true, // Allow cookies/auth headers
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  })
);

// ✅ Handle Preflight Requests Properly
app.options("*", cors());

// ✅ Serve Static Files (Ensure `manifest.json` Loads Properly)
app.use(express.static(path.join(__dirname, "public")));

// ✅ Middleware to Parse JSON Requests
app.use(express.json());

// ✅ Define API Routes
app.use("/api/auth", authRouter);
app.use("/api/quiz", quizRouter);
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Global Error Handling Middleware (Improves Debugging)
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
