const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: String,
  img: String,
  date: String,
  location: String,
  category: String
});

module.exports = mongoose.model('Project', projectSchema);
