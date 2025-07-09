require('dotenv').config();  // <-- load env variables early

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const contactRoute = require('./routes/Contact');
const projectRoutes = require('./routes/projectRoutes');
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Mount contact routes on /api/contact
app.use('/api/contact', contactRoute);
app.use('/api/projects', projectRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
