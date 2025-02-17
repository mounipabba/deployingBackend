// models/MidPaper.js
const mongoose = require("mongoose");

const MidPaperSchema = new mongoose.Schema({
  filename: String,
  fileId: { type: String },
  contentType: String,
  uploadDate: Date,
  subject: String,
  metaData: Object,
});

module.exports = mongoose.model("MidPapers", MidPaperSchema);
