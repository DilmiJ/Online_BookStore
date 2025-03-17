const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = 5000; // Frontend runs on 5173, backend 5000

// Middleware
app.use(cors());
app.use(express.json()); // Parses JSON body requests

// MongoDB Connection
mongoose.connect('mongodb+srv://Dilmi:2001dilmi@cluster0.2tc4t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.log(err));

// Routes
app.use('/api/auth', authRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
