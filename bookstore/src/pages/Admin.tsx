import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdInventory } from 'react-icons/md'; 
import { FaChartLine } from 'react-icons/fa'; 

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (!storedUser) {
      navigate('/login');
      return;
    }

    const user = JSON.parse(storedUser);

    if (user.role !== 'admin') {
      alert('Access denied. Admins only!');
      navigate('/');
    } else {
      setUserName(user.name || 'Admin');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const goToInventory = () => {
    navigate('/admin/inventory');
  };

  const goToSales = () => {
    navigate('/admin/sales');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-red-600 mb-2">Admin Dashboard</h1>
        <p className="text-lg text-gray-600">Welcome, {userName}!</p>
      </div>

      <div className="flex flex-row space-x-8 items-center">
        <div
          onClick={goToInventory}
          className="w-64 h-64 bg-white shadow-lg rounded-xl flex flex-col justify-center items-center cursor-pointer hover:shadow-2xl transition-transform transform hover:scale-105"
        >
          <MdInventory className="text-blue-600 mb-4" size={80} />
          <h2 className="text-xl font-semibold text-gray-800">Inventory Management</h2>
        </div>

        <div
          onClick={goToSales}
          className="w-64 h-64 bg-white shadow-lg rounded-xl flex flex-col justify-center items-center cursor-pointer hover:shadow-2xl transition-transform transform hover:scale-105"
        >
          <FaChartLine className="text-green-600 mb-4" size={80} />
          <h2 className="text-xl font-semibold text-gray-800">Sales Management</h2>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="mt-10 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default Admin;
