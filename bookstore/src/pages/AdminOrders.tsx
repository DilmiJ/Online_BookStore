import React, { useEffect, useState } from 'react';

interface Order {
  _id: string;
  userEmail: string;
  billingAddress: string;
  phoneNumber: string;
  totalPrice: number;
  orderStatus: string;
  cartItems: {
    _id: string;
    title: string;
    price: number;
    quantity: number;
  }[];
  createdAt: string;
}
const token = localStorage.getItem('token');

const res = await fetch('http://localhost:5000/api/admin/orders', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/admin/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };
  

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Order status updated!');
        fetchOrders();
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-300 p-4">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-blue-600">Admin Orders Dashboard</h1>

        {loading ? (
          <p>Loading orders...</p>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="border p-4 mb-4 rounded shadow-sm bg-gray-50">
              <p><strong>Order ID:</strong> {order._id}</p>
              <p><strong>User Email:</strong> {order.userEmail}</p>
              <p><strong>Billing Address:</strong> {order.billingAddress}</p>
              <p><strong>Phone Number:</strong> {order.phoneNumber}</p>
              <p><strong>Total Price:</strong> LKR {order.totalPrice}</p>
             
              <p><strong>Placed On:</strong> {new Date(order.createdAt).toLocaleString()}</p>

              <div className="mt-4">
                <h3 className="font-semibold text-blue-600 mb-2">Ordered Items:</h3>
                <div className="space-y-2">
                  {order.cartItems && order.cartItems.length > 0 ? (
                    order.cartItems.map((item) => (
                      <div key={item._id} className="flex justify-between items-center bg-white p-2 rounded shadow">
                        <div>
                          <p className="font-medium text-gray-800">📚 {item.title}</p>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-gray-800">LKR {item.price}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-600">No items in this order</p>
                  )}
                </div>
              </div>
              <p><strong>Status:</strong> {order.orderStatus}</p>
              <div className="mt-4 space-x-2">
                {['Pending', 'Processing', 'Shipped', 'Completed'].map((status) => (
                  <button
                    key={status}
                    onClick={() => updateOrderStatus(order._id, status)}
                    className={`px-3 py-1 rounded text-white ${
                      order.orderStatus === status
                        ? 'bg-green-600'
                        : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
