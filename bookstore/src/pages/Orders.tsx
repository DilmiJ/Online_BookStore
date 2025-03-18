import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Order {
  _id: string;
  billingAddress: string;
  phoneNumber: string;
  paymentMethod: string;
  totalPrice: number;
  cartItems: {
    _id: string;
    title: string;
    price: number;
    quantity: number;
  }[];
  createdAt: string;
}

const Orders: React.FC = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (!storedUser) {
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);

    fetchOrders(parsedUser.email);
  }, [navigate]);

  const fetchOrders = async (email: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`http://localhost:5000/api/orders/${email}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Failed to fetch orders.');
        setOrders([]);
      } else {
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error('Fetch orders error:', error);
      setError('An error occurred while fetching orders.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-blue-100 to-blue-300 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white/90 p-8 rounded-3xl shadow-2xl backdrop-blur-sm">
        <h1 className="text-4xl font-extrabold text-blue-600 mb-8 text-center drop-shadow-sm">
          My Orders
        </h1>

        {loading && (
          <p className="text-center text-blue-500 font-medium text-lg animate-pulse">
            Loading orders...
          </p>
        )}

        {error && (
          <p className="text-center text-red-500 font-semibold text-lg">{error}</p>
        )}

        {!loading && !error && orders.length === 0 && (
          <p className="text-center text-gray-600 text-lg">No orders found.</p>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="border border-blue-200 bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-semibold text-blue-700">Order ID:</span> {order._id}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-semibold text-blue-700">Billing Address:</span> {order.billingAddress}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-semibold text-blue-700">Phone Number:</span> {order.phoneNumber}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-semibold text-blue-700">Payment Method:</span>{' '}
                    {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card Payment'}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-semibold text-blue-700">Total Price:</span> LKR {order.totalPrice}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold text-blue-700">Ordered On:</span>{' '}
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="mt-6">
                  <h3 className="text-md font-semibold text-blue-600 mb-3">Items Ordered</h3>
                  <div className="space-y-3">
                    {order.cartItems.map((item) => (
                      <div
                        key={item._id}
                        className="bg-blue-50 rounded-xl px-4 py-3 flex justify-between items-center text-sm"
                      >
                        <div>
                          <p className="font-medium text-blue-700">📚 {item.title}</p>
                          <p className="text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-blue-600 font-semibold">LKR {item.price}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all shadow-md font-semibold"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Orders;
