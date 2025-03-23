const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  buyQuantity: { type: Number, required: true }
});

const cartSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  cartItems: [cartItemSchema]
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);
