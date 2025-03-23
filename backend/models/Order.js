const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  billingAddress: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  paymentMethod: { type: String, enum: ['cash', 'card'], required: true },
  paymentDetails: {
    cardNumber: { type: String },
    expiryDate: { type: String },
    cvc: { type: String }
  },
  cartItems: [{
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' }, // Book reference
    title: { type: String, required: true },                   // Add title field
    buyQuantity: { type: Number, required: true },             // How many user bought
    price: { type: Number, required: true }                    // Price at time of purchase
  }],
  totalPrice: { type: Number, required: true },
  orderStatus: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Completed'],
    default: 'Pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
