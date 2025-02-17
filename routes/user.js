const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const authenticate = require("../middleware/authenticate"); // Import the authentication middleware
const Quiz = require("../models/Quiz"); // Import the Quiz model
const Syllabus = require("../models/Syllabus");
const Material = require("../models/Material");
const MidPaper = require("../models/MidPaper");
const PreviousPaper = require("../models/PreviousPaper");

// Route to fetch the quiz history for the authenticated user
router.get("/history", authenticate, async (req, res) => {
  try {
    const quizHistory = await Quiz.find({ user: req.user._id })
      .sort({ date: -1 })
      .populate("results.questionId");

    res.json(quizHistory);
  } catch (err) {
    //console.error("Error fetching history:", err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

router.get("/details/:quizId", authenticate, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId).populate(
      "results.questionId"
    );

    if (!quiz || quiz.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    //console.log("Fetched Quiz Details:", JSON.stringify(quiz, null, 2));
    res.json(quiz);
  } catch (err) {
    //console.error("Error fetching quiz details:", err);
    res.status(500).json({ error: "Failed to fetch quiz details" });
  }
});

router.get("/details/:quizId", authenticate, async (req, res) => {
  try {
    // Fetch the quiz by its ID
    const quiz = await Quiz.findById(req.params.quizId);

    if (!quiz || quiz.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    //console.log("Fetched Quiz Details:", JSON.stringify(quiz, null, 2));

    // Return the full quiz data including results
    res.json(quiz);
  } catch (err) {
    //console.error("Error fetching quiz details:", err);
    res.status(500).json({ error: "Failed to fetch quiz details" });
  }
});



router.get("/syllabus/:subject", async (req, res) => {
    try {
        const subjectParam = decodeURIComponent(req.params.subject).trim(); // Decode the subject

        const syllabus = await Syllabus.findOne({
            subject: { $regex: new RegExp(`^${subjectParam}$`, "i") }, // Case-insensitive search
        }).sort({ uploadDate: -1 }); // Get the most recently uploaded syllabus

        if (!syllabus) {
            return res.status(404).json({ message: "Syllabus not found for this subject." });
        }

        res.status(200).json(syllabus); // Send the syllabus data (including fileId and filename)

    } catch (error) {
        console.error("Error fetching syllabus:", error);
        res.status(500).json({ message: "Server error fetching syllabus." });
    }
});



// In routes/admin.js (or wherever your /syllabus-file route is):
router.get("/syllabus-file/:id", async (req, res) => {
    try {
      const fileId = req.params.id;
      const db = mongoose.connection.db;
      const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: "uploads" });
  
      bucket.openDownloadStream(new mongoose.Types.ObjectId(fileId))
        .on("error", (err) => {
          console.error("Error streaming file:", err);
          return res.status(404).json({ message: "File not found." }); // Important: 404 if not found
        })
        .pipe(res);
    } catch (error) {
      console.error("Error in GET /syllabus-file/:id:", error);
      res.status(500).json({ message: "Server error fetching file." });
    }
  });


  router.get("/material/:subject", async (req, res) => {
    try {
      const subjectParam = decodeURIComponent(req.params.subject).trim();
  
      // Find the most recently uploaded material for the subject
      const material = await Material.findOne({
        subject: { $regex: new RegExp(`^${subjectParam}$`, "i") },
      }).sort({ uploadDate: -1 });
  
      if (!material) {
        return res.status(404).json({ message: "Material not found for this subject." });
      }
  
      res.status(200).json(material);
    } catch (error) {
      console.error("Error fetching material:", error);
      res.status(500).json({ message: "Server error fetching material." });
    }
  });

  router.get("/material-file/:id", async (req, res) => {
    try {
      const fileId = req.params.id;
      const db = mongoose.connection.db;
      const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: "uploads" });
  
      bucket.openDownloadStream(new mongoose.Types.ObjectId(fileId))
        .on("error", (err) => {
          console.error("Error streaming file:", err);
          return res.status(404).json({ message: "File not found." });
        })
        .pipe(res);
    } catch (error) {
      console.error("Error in GET /material-file/:id:", error);
      res.status(500).json({ message: "Server error fetching file." });
    }
  });
  

  // Get the latest midpapers metadata for a subject
router.get("/midpapers/:subject", async (req, res) => {
  try {
    const subjectParam = decodeURIComponent(req.params.subject).trim();
    const midpaper = await MidPaper.findOne({
      subject: { $regex: new RegExp(`^${subjectParam}$`, "i") },
    }).sort({ uploadDate: -1 });
    
    if (!midpaper) {
      return res.status(404).json({ message: "Midpapers not found for this subject." });
    }
    
    res.status(200).json(midpaper);
  } catch (error) {
    console.error("Error fetching midpapers:", error);
    res.status(500).json({ message: "Server error fetching midpapers." });
  }
});

// Optionally, if you want the user router to serve the midpapers file directly, add:
router.get("/midpapers-file/:id", async (req, res) => {
  try {
    const fileId = req.params.id;
    const db = mongoose.connection.db;
    const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: "uploads" });
    
    bucket.openDownloadStream(new mongoose.Types.ObjectId(fileId))
      .on("error", (err) => {
        console.error("Error streaming midpapers file:", err);
        return res.status(404).json({ message: "File not found." });
      })
      .pipe(res);
  } catch (error) {
    console.error("Error in GET /midpapers-file/:id:", error);
    res.status(500).json({ message: "Server error fetching file." });
  }
});

router.get("/previouspapers/:subject", async (req, res) => {
  try {
    const subjectParam = decodeURIComponent(req.params.subject).trim();
    const previousPaper = await PreviousPaper.findOne({
      subject: { $regex: new RegExp(`^${subjectParam}$`, "i") },
    }).sort({ uploadDate: -1 });
    
    if (!previousPaper) {
      return res.status(404).json({ message: "Previous papers not found for this subject." });
    }
    
    res.status(200).json(previousPaper);
  } catch (error) {
    console.error("Error fetching previous papers:", error);
    res.status(500).json({ message: "Server error fetching previous papers." });
  }
});

// --------------------------------------
// Stream Previous Papers File by FileId
// --------------------------------------
router.get("/previouspapers-file/:id", async (req, res) => {
  try {
    const fileId = req.params.id;
    const db = mongoose.connection.db;
    const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: "uploads" });
    
    bucket.openDownloadStream(new mongoose.Types.ObjectId(fileId))
      .on("error", (err) => {
        console.error("Error streaming file:", err);
        return res.status(404).json({ message: "File not found." });
      })
      .pipe(res);
  } catch (error) {
    console.error("Error in GET /previouspapers-file/:id:", error);
    res.status(500).json({ message: "Server error fetching file." });
  }
});
  
module.exports = router;

