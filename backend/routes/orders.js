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
      userEmail
    } = req.body;

    if (!billingAddress || !phoneNumber || !paymentMethod || !cartItems.length || !totalPrice || !userEmail) {
      return res.status(400).json({ message: 'All required fields must be provided!' });
    }

    if (paymentMethod === 'card') {
      if (!paymentDetails.cardNumber || !paymentDetails.expiryDate || !paymentDetails.cvc) {
        return res.status(400).json({ message: 'Card details are required for card payments!' });
      }
    }

    const newOrder = new Order({
      billingAddress,
      phoneNumber,
      paymentMethod,
      paymentDetails: paymentMethod === 'card' ? paymentDetails : {},
      cartItems: cartItems.map(item => ({
        _id: item._id,
        title: item.title,
        buyQuantity: item.buyQuantity,
        price: item.price
      })),
      totalPrice,
      userEmail
    });

    const savedOrder = await newOrder.save();

    res.status(201).json({
      message: 'Order placed successfully!',
      order: savedOrder
    });
  } catch (error) {
    console.error('Place order error:', error);
    res.status(500).json({ message: 'Failed to place order' });
  }
});

router.get('/:email', async (req, res) => {
  try {
    const email = req.params.email;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const orders = await Order.find({ userEmail: email }).sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (error) {
    console.error('Fetch user orders error:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

router.get('/admin/all', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.status(200).json({ orders });
  } catch (error) {
    console.error('Admin fetch orders error:', error);
    res.status(500).json({ message: 'Failed to fetch all orders.' });
  }
});

router.put('/admin/orders/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findByIdAndUpdate(
      id,
      { orderStatus: status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    res.json({ message: 'Order status updated.', order });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Failed to update order status.' });
  }
});

module.exports = router;
