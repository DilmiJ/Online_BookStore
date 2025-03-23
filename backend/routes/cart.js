const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');

router.post('/', async (req, res) => {
  const { userEmail, cartItems } = req.body;

  if (!userEmail || !cartItems || cartItems.length === 0) {
    return res.status(400).json({ message: 'User email and cart items are required.' });
  }

  try {
    let cart = await Cart.findOne({ userEmail });

    if (cart) {
      cart.cartItems = cartItems;
      await cart.save();
    } else {
      cart = new Cart({ userEmail, cartItems });
      await cart.save();
    }

    res.status(201).json({ message: 'Cart saved successfully', cart });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save cart' });
  }
});

router.get('/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const cart = await Cart.findOne({ userEmail: email });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    res.status(200).json({ cart });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch cart' });
  }
});

module.exports = router;
