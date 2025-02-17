const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

const authRouter = require("./routes/auth");
const quizRouter = require("./routes/quiz");
const userRouter = require("./routes/user");
const adminRouter = require("./routes/admin");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Define Allowed Origins
const allowedOrigins = [
  "http://localhost:3000", // Local development (adjust port if needed)
  "https://deploying-full-stack-sigma.vercel.app", // Deployed frontend with correct protocol
];

// ✅ CORS Configuration: Dynamically allow requests from whitelisted origins
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow cookies/auth headers
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  })
);

// ✅ Handle Preflight Requests Properly
app.options("*", cors());

// ✅ Serve Static Files (ensures files like `manifest.json` load properly)
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
