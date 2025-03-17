const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Routes
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes'); // <-- Add this if you have book routes

const app = express();
const PORT = 5000; // Frontend runs on 5173, backend 5000


// Middleware
app.use(cors());
app.use(express.json()); // Parses JSON body requests

// MongoDB Connection
mongoose.connect('mongodb+srv://Dilmi:2001dilmi@cluster0.2tc4t.mongodb.net/bookstore?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.log(err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes); // <-- Add this for your book API endpoints

// Start Server
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
