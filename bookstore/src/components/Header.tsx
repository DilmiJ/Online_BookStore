import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img src="https://via.placeholder.com/40x40" alt="Logo" className="w-10 h-10" />
          <div>
            <h1 className="text-xl font-bold text-blue-600">CGA BOOKS</h1>
            <p className="text-xs text-gray-500">A book can change your life</p>
          </div>
        </div>

        {/* Search */}
        <div className="flex w-1/2">
          <input
            type="text"
            placeholder="Search our catalog"
            className="flex-grow px-4 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button className="bg-blue-500 px-4 py-2 text-white rounded-r hover:bg-blue-600">
            🔍
          </button>
        </div>

        {/* Contact / Login / Cart */}
        <div className="flex space-x-4 text-sm">
          <button className="hover:text-blue-500">Contact us</button>
          <button className="hover:text-blue-500">Sign in / Register</button>
          <button className="hover:text-blue-500">🛒 0</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
