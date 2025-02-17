const mongoose = require("mongoose");

const SyllabusSchema = new mongoose.Schema({
  filename: String,
  fileId: { type: String },
  contentType: String,
  uploadDate: Date,
  subject: String,
  metaData: Object,
});

module.exports = mongoose.model("Syllabuses", SyllabusSchema);
