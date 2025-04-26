const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Allow CORS from your frontend URL
const frontendURL = 'https://student-management-system-frontend-final.onrender.com';  

// Middleware
app.use(cors({
  origin: frontendURL,  // Allow only this domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allow specific HTTP methods if needed
  credentials: true,  // Allow cookies (if you need them)
}));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/student-management')
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/students', require('./routes/students'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
