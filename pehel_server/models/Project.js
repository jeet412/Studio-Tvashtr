const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: String,
  date: String,
  location: String,
  category: String,
  subcategory: String,
  img: String,      // Thumbnail shown on homepage
  fullImg: String   // BIG.dk-style long image shown on click
});

module.exports = mongoose.model('Project', projectSchema);

