const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// @route   GET /api/orders/:email
// @desc    Get all orders by user email
// @access  Public (Should be protected in real apps with authentication)
router.get('/:email', async (req, res) => {
  const email = req.params.email;

  try {
    if (!email) {
      return res.status(400).json({ message: 'User email is required.' });
    }

    const orders = await Order.find({ userEmail: email }).sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Orders fetched successfully',
      orders: orders || [],
    });
  } catch (error) {
    console.error('Fetch Orders Error:', error.message);
    res.status(500).json({
      message: 'Failed to fetch orders. Please try again later.',
    });
  }
});

module.exports = router;
