const express = require("express");
const router = express.Router();
const Question = require("../models/Question");
const Quiz = require("../models/Quiz");
const authenticate = require("../middleware/authenticate");

router.get("/details/:quizId", authenticate, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId)
      .populate({
        path: "results.questionId",
        select: "question options", // Assuming questionText is the field for the question's text
      })
      .exec();

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
// Route to get quiz history for authenticated user
router.get("/history", authenticate, async (req, res) => {
  try {
    const quizHistory = await Quiz.find({ user: req.user._id })
      .sort({ date: -1 })
      .populate({
        path: "results.questionId",
        select: "question options answer",
      });

    res.json(quizHistory);
  } catch (err) {
    //console.error("Error fetching history:", err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});
// Route to handle quiz submission
router.post("/submit", authenticate, async (req, res) => {
  const { subject, results } = req.body;

  try {
    //console.log("Subject:", subject);
    //console.log("Results:", results);

    const quizResult = new Quiz({
      user: req.user._id,
      subject,
      results,
      date: new Date(),
    });

    await quizResult.save();

    //console.log("Quiz saved successfully:", quizResult);

    res
      .status(200)
      .json({ message: "Quiz submitted successfully", quizResult });
  } catch (err) {
    //console.error("Error submitting quiz:", err);
    res.status(500).json({ error: "Failed to submit quiz" });
  }
});

router.get("/questions/:subject", async (req, res) => {
  const { subject } = req.params;
  try {
    //console.log("Subject:", subject);
    const questions = await Question.aggregate([
      { $match: { subject } },
      { $sample: { size: 20 } },
    ]);
    res.json(questions);
    //console.log("Questions fetched:", questions.length);
  } catch (err) {
    //console.error("Error fetching questions:", err);
    res.status(500).json({ error: "Failed to fetch questions." });
  }
});

module.exports = router;
