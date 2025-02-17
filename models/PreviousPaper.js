// models/PreviousPaper.js
const mongoose = require("mongoose");

const PreviousPaperSchema = new mongoose.Schema({
  filename: String,
  fileId: { type: String },
  contentType: String,
  uploadDate: Date,
  subject: String,
  metaData: Object,
});

module.exports = mongoose.model("PreviousPapers", PreviousPaperSchema);
