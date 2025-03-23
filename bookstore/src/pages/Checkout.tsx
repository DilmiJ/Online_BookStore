import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface CartItem {
  _id: string;
  title: string;
  author: string;
  price: number;
  quantity: number;
  description: string;
  buyQuantity: number;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const [billingAddress, setBillingAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvc: ''
  });
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
    const total = cart.reduce((acc: number, item: CartItem) => acc + item.price * item.buyQuantity, 0);
    setTotalPrice(total);
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
    } else {
      try {
        const parsedUser = JSON.parse(user);
        setUserEmail(parsedUser.email || parsedUser.userEmail || parsedUser);
      } catch {
        setUserEmail(user);
      }
    }
  }, [navigate]);

  const handlePhoneNumberChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setPhoneNumber(numericValue);
  };

  const handleCardNumberChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setPaymentDetails({ ...paymentDetails, cardNumber: numericValue });
  };

  const handleExpiryDateChange = (value: string) => {
    const formattedValue = value.replace(/[^0-9/]/g, '');
    setPaymentDetails({ ...paymentDetails, expiryDate: formattedValue });
  };

  const handleCVCChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setPaymentDetails({ ...paymentDetails, cvc: numericValue });
  };

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const handleCheckout = () => {
    if (!billingAddress.trim()) {
      alert('Billing address is required');
      return;
    }

    if (!phoneNumber.trim() || !validatePhoneNumber(phoneNumber)) {
      alert('Valid 10-digit phone number is required');
      return;
    }

    if (!paymentMethod) {
      alert('Select a payment method');
      return;
    }

    if (!cartItems.length) {
      alert('Your cart is empty');
      return;
    }

    if (!totalPrice) {
      alert('Total price cannot be zero');
      return;
    }

    if (!userEmail) {
      alert('User email not found');
      return;
    }

    if (paymentMethod === 'card') {
      if (!paymentDetails.cardNumber.trim() || paymentDetails.cardNumber.length < 12) {
        alert('Valid card number is required');
        return;
      }
      if (!paymentDetails.expiryDate.trim() || !/^\d{2}\/\d{2}$/.test(paymentDetails.expiryDate)) {
        alert('Valid expiry date is required (MM/YY)');
        return;
      }
      if (!paymentDetails.cvc.trim() || paymentDetails.cvc.length < 3) {
        alert('Valid 3-digit CVC is required');
        return;
      }
    }

    fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
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
      })
    })
      .then(async res => {
        let data;
        try {
          data = await res.json();
        } catch {
          alert('Server error: invalid JSON response');
          return;
        }
        if (res.ok) {
          alert('Order placed successfully!');
          localStorage.removeItem('cart');
          navigate('/');
        } else {
          alert(data.message || 'Failed to place order');
        }
      })
      .catch(() => {
        alert('Checkout failed. Please try again later.');
      });
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-400 via-blue-300 to-blue-200 p-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg p-8">
        <h2 className="text-3xl font-bold mb-8 text-center text-blue-600">Checkout</h2>

        <div className="mb-6">
          <label className="block text-md font-medium text-blue-700 mb-2">Billing Address</label>
          <input
            type="text"
            value={billingAddress}
            onChange={(e) => setBillingAddress(e.target.value)}
            placeholder="Enter billing address"
            className="w-full px-4 py-3 rounded-lg border border-blue-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="mb-6">
          <label className="block text-md font-medium text-blue-700 mb-2">Phone Number</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => handlePhoneNumberChange(e.target.value)}
            placeholder="Enter phone number"
            className="w-full px-4 py-3 rounded-lg border border-blue-300 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="mb-6">
          <label className="block text-md font-medium text-blue-700 mb-2">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-blue-300 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="cash">Cash on Delivery</option>
            <option value="card">Card Payment</option>
          </select>
        </div>

        {paymentMethod === 'card' && (
          <div className="space-y-6 mb-6">
            <div>
              <label className="block text-md font-medium text-blue-700 mb-2">Card Number</label>
              <input
                type="text"
                value={paymentDetails.cardNumber}
                onChange={(e) => handleCardNumberChange(e.target.value)}
                placeholder="Enter card number"
                className="w-full px-4 py-3 rounded-lg border border-blue-300 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-md font-medium text-blue-700 mb-2">Expiry Date (MM/YY)</label>
              <input
                type="text"
                value={paymentDetails.expiryDate}
                onChange={(e) => handleExpiryDateChange(e.target.value)}
                placeholder="MM/YY"
                className="w-full px-4 py-3 rounded-lg border border-blue-300 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-md font-medium text-blue-700 mb-2">CVC</label>
              <input
                type="text"
                value={paymentDetails.cvc}
                onChange={(e) => handleCVCChange(e.target.value)}
                placeholder="CVC"
                className="w-full px-4 py-3 rounded-lg border border-blue-300 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        )}

        <div className="mb-6 text-lg text-blue-700 font-semibold">
          Total: <span className="text-blue-900">LKR {totalPrice}</span>
        </div>

        <button
          onClick={handleCheckout}
          className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg hover:bg-blue-700 transition duration-300"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Checkout;
