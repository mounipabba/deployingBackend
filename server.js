const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors"); // Import cors
const authRouter = require("./routes/auth");
const quizRouter = require("./routes/quiz");
const userRouter = require("./routes/user");
const adminRouter = require("./routes/admin");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Apply CORS middleware BEFORE defining routes
app.use(
  cors({
    origin: "http://localhost:3000", // Allow this origin
    credentials: true,              // Allow cookies/credentials
  })
);

// Also, if you want to handle preflight requests:
app.options("*", cors());

app.use(express.json());

// Define your routes
app.use("/api/auth", authRouter);
app.use("/api/quiz", quizRouter);
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);


// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => console.log("MongoDB connection error:", err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
