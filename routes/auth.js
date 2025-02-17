const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authenticate = require("../middleware/authenticate");

router.post("/register", async (req, res) => {
  const {
    rollNo,
    name,
    branch,
    section,
    yearOfStudy,
    gender,
    mobileNo,
    emailId,
    username,
    password,
    confirmPassword,
  } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).send({ error: "Passwords do not match" });
  }

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/;

  if (!passwordRegex.test(password)) {
    return res.status(400).send({
      error:
        "Password must be at least 6 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.",
    });
  }

  try {
    // Check if username is unique
    const existingUserByRollNo = await User.findOne({ rollNo });
    const existingUserByUsername = await User.findOne({ username });

    if (existingUserByRollNo) {
      return res.status(400).json({ error: "Roll No already exists" });
    }
    if (existingUserByUsername) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const user = new User({
      rollNo,
      name,
      branch,
      section,
      yearOfStudy,
      gender,
      mobileNo,
      emailId,
      username,
      password,
    });

    await user.save();
    res.status(201).json({ message: "Registration successful" });
  } catch (error) {
    //console.error("Error during registration:", error);
    res
      .status(500)
      .json({ error: "Failed to register user. Please try again." });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    //console.log("Received credentials:", username, password);
    const user = await User.findByCredentials(username, password);
    //console.log("User found:", user);
    const token = await user.generateAuthToken();
    //console.log("Token generated:", token);
    res.status(200).send({ user, token });
  } catch (error) {
    //console.error("Login error:", error.message);
    res.status(400).send({ error: "Invalid login credentials" });
  }
});

// Get authenticated user route
router.get("/user", authenticate, async (req, res) => {
  res.send(req.user);
});

module.exports = router;
