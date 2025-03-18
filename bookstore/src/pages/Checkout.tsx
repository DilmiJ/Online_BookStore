import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Book {
  _id: string;
  title: string;
  price: number;
  quantity: number;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState<Book[]>([]);
  const [billingAddress, setBillingAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod'); 
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');

  const [totalPrice, setTotalPrice] = useState(0);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    // Get user from localStorage
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');

    if (!storedUser || !storedUser.email) {
      // Redirect to login if user not found
      navigate('/login');
      return;
    }

    setUserEmail(storedUser.email);

    // Get cart items from localStorage
    const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(storedCart);

    const total = storedCart.reduce((sum: number, item: Book) => {
      return sum + item.price * item.quantity;
    }, 0);

    setTotalPrice(total);
  }, [navigate]);

  const handlePayment = async () => {
    // Validation for address and phone
    if (!billingAddress || !phoneNumber) {
      alert('Please fill in your billing address and phone number.');
      return;
    }

    // Validation for card payment details
    if (paymentMethod === 'card') {
      if (!cardNumber || !expiryDate || !cvc) {
        alert('Please fill in all card details.');
        return;
      }
    }

    const orderData = {
      billingAddress,
      phoneNumber,
      paymentMethod,
      cartItems,
      totalPrice,
      userEmail, // ✅ Send user email to backend
      paymentDetails:
        paymentMethod === 'card'
          ? {
              cardNumber,
              expiryDate,
              cvc,
            }
          : {},
    };

    try {
      const res = await fetch('http://localhost:5000/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Payment Successful!');

        // Clear the cart after successful payment
        localStorage.removeItem('cart');

        // Redirect to dashboard or success page
        navigate('/dashboard');
      } else {
        alert(`Payment Failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Payment Error:', error);
      alert('An error occurred during payment.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-300 p-4">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-blue-600 mb-4">Checkout</h1>

        {/* Billing Address */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Billing Address</label>
          <textarea
            value={billingAddress}
            onChange={(e) => setBillingAddress(e.target.value)}
            className="w-full p-2 border rounded mt-1"
            placeholder="Enter your billing address"
          />
        </div>

        {/* Phone Number */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Phone Number</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full p-2 border rounded mt-1"
            placeholder="Enter your phone number"
          />
        </div>

        {/* Payment Method */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Payment Method</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full p-2 border rounded mt-1"
          >
            <option value="cod">Cash on Delivery</option>
            <option value="card">Card Payment</option>
          </select>
        </div>

        {/* Card Payment Fields */}
        {paymentMethod === 'card' && (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium">Card Number</label>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full p-2 border rounded mt-1"
                placeholder="1234 5678 9012 3456"
              />
            </div>

            <div className="flex space-x-4 mb-4">
              <div className="w-1/2">
                <label className="block text-gray-700 font-medium">Expiry Date</label>
                <input
                  type="text"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full p-2 border rounded mt-1"
                  placeholder="MM/YY"
                />
              </div>

              <div className="w-1/2">
                <label className="block text-gray-700 font-medium">CVC</label>
                <input
                  type="text"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value)}
                  className="w-full p-2 border rounded mt-1"
                  placeholder="123"
                />
              </div>
            </div>
          </>
        )}

        {/* Total Price */}
        <div className="text-lg font-semibold text-gray-700 mb-4">
          Total Price: LKR {totalPrice}
        </div>

        {/* Pay Now Button */}
        <button
          onClick={handlePayment}
          className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 text-lg font-semibold"
        >
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default Checkout;
