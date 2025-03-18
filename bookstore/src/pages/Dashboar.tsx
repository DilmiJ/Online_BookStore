import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogOut,
  ShoppingCart,
  PackageCheck,
  Settings,
  HelpCircle,
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-blue-300 p-4 flex flex-col">
      
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow mb-6">
        
        <h1 className="text-2xl font-semibold text-blue-600">
          {user ? `Welcome, ${user.name}!` : 'Loading...'}
        </h1>

        
        <div className="flex items-center space-x-4">
        <button
  onClick={() => navigate('/cart')}
  className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-full shadow hover:bg-green-600 transition"
>
  <ShoppingCart className="w-5 h-5" />
  <span>Cart</span>
</button>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-full shadow hover:bg-red-600 transition"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      
      <div className="flex flex-grow justify-center items-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
          
          <button
            onClick={() => navigate('/orders')}
            className="flex flex-col items-center justify-center bg-white p-8 rounded-2xl shadow hover:shadow-lg transition transform hover:-translate-y-1"
          >
            <PackageCheck className="w-12 h-12 mb-4 text-blue-500" />
            <span className="text-lg font-medium text-gray-700">My Orders</span>
          </button>

          
          <button
            onClick={() => navigate('/account-settings')}
            className="flex flex-col items-center justify-center bg-white p-8 rounded-2xl shadow hover:shadow-lg transition transform hover:-translate-y-1"
          >
            <Settings className="w-12 h-12 mb-4 text-green-500" />
            <span className="text-lg font-medium text-gray-700">Account Settings</span>
          </button>

          
          <button
            onClick={() => navigate('/help')}
            className="flex flex-col items-center justify-center bg-white p-8 rounded-2xl shadow hover:shadow-lg transition transform hover:-translate-y-1"
          >
            <HelpCircle className="w-12 h-12 mb-4 text-purple-500" />
            <span className="text-lg font-medium text-gray-700">Help Center</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
