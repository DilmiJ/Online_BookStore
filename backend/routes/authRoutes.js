const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// SIGNUP
router.post('/signup', async (req, res) => {
  console.log('Received data:', req.body);

  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please fill all fields' });
  }

  try {
    const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const userRole = role === 'admin' ? 'admin' : 'user'; // Safe default to 'user'

    const newUser = new User({
      name,
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role: userRole
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      message: 'User created successfully!',
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role
      }
    });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password.' });
  }

  try {
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    
    const token = jwt.sign(
      { id: user._id, role: user.role },
      'your_jwt_secret', 
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: `${user.role === 'admin' ? 'Admin' : 'User'} login successful!`,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token: token
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
