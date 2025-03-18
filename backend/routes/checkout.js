const express = require('express');
const router = express.Router();
const Order = require('../models/Order');


router.post('/', async (req, res) => {
  try {
    const {
      billingAddress,
      phoneNumber,
      paymentMethod,
      paymentDetails,
      cartItems,
      totalPrice,
      userEmail,
    } = req.body;

    
    if (!billingAddress || !phoneNumber || !paymentMethod || !cartItems || !totalPrice || !userEmail) {
      return res.status(400).json({ message: 'All required fields must be provided!' });
    }

    
    if (paymentMethod === 'card') {
      if (!paymentDetails || !paymentDetails.cardNumber || !paymentDetails.expiryDate || !paymentDetails.cvc) {
        return res.status(400).json({ message: 'Card details are required for card payments!' });
      }
    }

    
    const newOrder = new Order({
      billingAddress,
      phoneNumber,
      paymentMethod,
      paymentDetails: paymentMethod === 'card' ? paymentDetails : {},
      cartItems,
      totalPrice,
      userEmail,
    });

    
    const savedOrder = await newOrder.save();

    
    res.status(201).json({
      message: 'Order placed successfully!',
      order: savedOrder,
    });

  } catch (error) {
    console.error('Error placing order:', error.message);
    res.status(500).json({
      message: 'Failed to place order. Please try again later.',
    });
  }
});

module.exports = router;
