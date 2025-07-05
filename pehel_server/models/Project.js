const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: String,
  date: String,
  location: String,
  category: String,
  subcategory: String,
  img: String,      // Thumbnail shown on homepage
  fullImg: String,
 
});

module.exports = mongoose.model('Project', projectSchema);

