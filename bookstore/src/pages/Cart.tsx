import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Book {
  _id: string;
  title: string;
  author: string;
  price: number;
  quantity: number;
  description: string;
}

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<Book[]>([]);

  // Load cart items from localStorage 
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(storedCart);
  }, []);

  const handleRemoveFromCart = (id: string) => {
    const updatedCart = cartItems.filter(item => item._id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleIncrementQuantity = (id: string) => {
    const updatedCart = cartItems.map(item => {
      if (item._id === id) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });

    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  
  const handleDecrementQuantity = (id: string) => {
    const updatedCart = cartItems.map(item => {
      if (item._id === id && item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });

    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-300 p-4">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow mb-6">
        <h1 className="text-2xl font-semibold text-blue-600">Your Cart</h1>

        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
        >
          Go Back
        </button>
      </div>

      {cartItems.length === 0 ? (
        <p className="text-center text-lg text-gray-700">Your cart is empty!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl shadow-md p-4 flex flex-col justify-between"
            >
              <div className="flex justify-center items-center h-40 bg-gray-100 rounded-xl mb-4">
                <span className="text-5xl">📚</span>
              </div>

              <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
              <p className="text-gray-600">By {item.author}</p>
              <p className="text-gray-700 mt-2">Price: LKR {item.price}</p>

              
              <div className="flex items-center mt-2 space-x-2">
                <button
                  onClick={() => handleDecrementQuantity(item._id)}
                  className="px-2 py-1 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded"
                >
                  -
                </button>
                <span className="px-4">{item.quantity}</span>
                <button
                  onClick={() => handleIncrementQuantity(item._id)}
                  className="px-2 py-1 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => handleRemoveFromCart(item._id)}
                className="mt-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {cartItems.length > 0 && (
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleCheckout}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 text-lg font-semibold"
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
