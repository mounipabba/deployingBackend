// models/Material.js
const mongoose = require("mongoose");

const MaterialSchema = new mongoose.Schema({
  filename: String,
  fileId: { type: String },
  contentType: String,
  uploadDate: Date,
  subject: String,
  metaData: Object,
});

module.exports = mongoose.model("Materials", MaterialSchema);
