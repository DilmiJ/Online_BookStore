const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secretKey = 'Dilmi';

// SIGNUP
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },  
      'Dilmi',
      { expiresIn: '1d' }
    );

    res.status(201).json({ message: 'Signup successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  const user = await User.findOne({ email });
  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    secretKey,
    { expiresIn: '1d' }
  );

  res.json({ message: 'Login successful', token });
});
router.get('/:userId/cart', async (req, res) => {
  const user = await User.findById(req.params.userId).populate('cart.bookId');
  res.json(user.cart);
});

router.post('/:userId/cart', async (req, res) => {
  const { bookId, quantity } = req.body;
  const user = await User.findById(req.params.userId);
  const cartItem = user.cart.find(item => item.bookId.toString() === bookId);
  if (cartItem) {
    cartItem.quantity += quantity;
  } else {
    user.cart.push({ bookId, quantity });
  }
  await user.save();
  res.json(user.cart);
});

router.patch('/:userId/cart', async (req, res) => {
  const { bookId, quantity } = req.body;
  const user = await User.findById(req.params.userId);
  const cartItem = user.cart.find(item => item.bookId.toString() === bookId);
  if (!cartItem) return res.status(404).json({ message: 'Item not found in cart' });
  cartItem.quantity = quantity;
  await user.save();
  res.json(user.cart);
});

router.post('/:userId/checkout', async (req, res) => {
  const user = await User.findById(req.params.userId).populate('cart.bookId');
  for (let item of user.cart) {
    const book = await Book.findById(item.bookId._id);
    if (book.quantity < item.quantity) return res.status(400).json({ message: `Not enough stock for ${book.title}` });
    book.quantity -= item.quantity;
    await book.save();
  }
  user.cart = [];
  await user.save();
  res.json({ message: 'Checkout successful' });
});


module.exports = router;
