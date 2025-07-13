const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: String,
  date: String,
  location: String,
  category: String,
  subcategory: String,
  img: String, // Thumbnail shown on homepage

  // New field: array of slides from 3rd slide onwards
  slides: [
    {
      type: { type: String, enum: ['image', 'text', 'mixed'], required: true },
      image: String,  // For 'image' or 'mixed'
      text: String    // For 'text' or 'mixed'
    }
  ],
  client: String,
  typology: String,
  size: String,
  status: String,
});

module.exports = mongoose.model('Project', projectSchema);
