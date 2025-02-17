const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const resultSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
  userAnswer: String,
  correctAnswer: String,
  isCorrect: Boolean,
});

const quizSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  subject: { type: String, required: true },
  results: [resultSchema], // Store the results with references to questions
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Quiz", quizSchema);
