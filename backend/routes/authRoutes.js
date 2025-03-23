const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Book = require('../models/Book');
const bcrypt = require('bcryptjs');

// ==============================
// SIGNUP ROUTE (NO JWT)
// ==============================
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({
      message: 'Signup successful',
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==============================
// LOGIN ROUTE (NO JWT)
// ==============================
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      message: 'Login successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==============================
// GET CART (NO AUTH)
// ==============================
router.get('/:userId/cart', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('cart.bookId');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.cart);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==============================
// ADD TO CART (NO AUTH)
// ==============================
router.post('/:userId/cart', async (req, res) => {
  const { bookId, quantity } = req.body;

  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const cartItem = user.cart.find(item => item.bookId.toString() === bookId);
    if (cartItem) {
      cartItem.quantity += quantity;
    } else {
      user.cart.push({ bookId, quantity });
    }

    await user.save();
    res.json(user.cart);
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==============================
// UPDATE CART ITEM QUANTITY (NO AUTH)
// ==============================
router.patch('/:userId/cart', async (req, res) => {
  const { bookId, quantity } = req.body;

  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const cartItem = user.cart.find(item => item.bookId.toString() === bookId);
    if (!cartItem) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    cartItem.quantity = quantity;
    await user.save();

    res.json(user.cart);
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ==============================
// CHECKOUT ROUTE (NO AUTH)
// ==============================
router.post('/:userId/checkout', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('cart.bookId');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    for (let item of user.cart) {
      const book = await Book.findById(item.bookId._id);

      if (!book) {
        return res.status(404).json({ message: `Book not found: ${item.bookId._id}` });
      }

      if (book.quantity < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for ${book.title}` });
      }

      book.quantity -= item.quantity;
      await book.save();
    }

    user.cart = [];
    await user.save();

    res.json({ message: 'Checkout successful' });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
