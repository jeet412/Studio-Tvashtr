const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: String,
  date: String,
  location: String,
  category: String,
  img: String, 
  media: [
    {
      img: String,           // image URL
      description: String    // corresponding description
    }
  ]
});

module.exports = mongoose.model('Project', projectSchema);

