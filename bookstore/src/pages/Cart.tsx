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

interface CartItem extends Book {
  buyQuantity: number;
}

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    const cartWithBuyQuantity = storedCart.map((item: Book) => ({
      ...item,
      buyQuantity: 1
    }));
    setCartItems(cartWithBuyQuantity);
  }, []);

  const handleRemoveFromCart = (id: string) => {
    const updatedCart = cartItems.filter(item => item._id !== id);
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleQuantityChange = (id: string, value: number) => {
    const updatedCart = cartItems.map(item => {
      if (item._id === id) {
        const newQuantity = Math.max(1, Math.min(value, item.quantity));
        return { ...item, buyQuantity: newQuantity };
      }
      return item;
    });
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const getTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.buyQuantity, 0);
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
  
    const user = localStorage.getItem('user');
    if (!user) {
      navigate('/login');
      return;
    }
  
    let parsedUser;
    try {
      parsedUser = JSON.parse(user);
    } catch {
      parsedUser = { email: user };
    }
  
    try {
      const res = await fetch('http://localhost:5000/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: parsedUser.email || parsedUser.userEmail,
          cartItems
        })
      });
  
      const data = await res.json();
  
      if (res.ok) {
        navigate('/checkout');
      } else {
        alert(data.message || 'Failed to save cart');
      }
    } catch (error) {
      alert('Failed to save cart');
    }
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
              <p className="text-gray-700">In Stock: {item.quantity}</p>

              <div className="mt-4">
                <label className="block text-sm text-gray-600 mb-1">Select Quantity</label>
                <input
                  type="number"
                  min={1}
                  max={item.quantity}
                  value={item.buyQuantity}
                  onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value))}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>

              <div className="mt-4 text-gray-800 font-semibold">
                Subtotal: LKR {item.price * item.buyQuantity}
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
        <div className="mt-8 flex flex-col items-end">
          <div className="text-xl font-semibold text-gray-800 mb-4">
            Total: LKR {getTotal()}
          </div>
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
