import React from 'react';
import { FaSearch, FaUserAlt, FaPhoneAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-center">
      {/* Top-right buttons */}
      <div className="absolute top-6 right-6 flex space-x-4">
        <button
          onClick={handleLoginClick}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          <FaUserAlt />
          <span>Login</span>
        </button>

        <button className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">
          <FaPhoneAlt />
          <span>Contact</span>
        </button>
      </div>

      {/* Center Content */}
      <div className="flex flex-col items-center space-y-8">
        {/* Search Box */}
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search books..."
            className="w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 shadow-md"
          />
          <FaSearch className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400" />
        </div>

        {/* Headings */}
        <h1 className="smooth-float text-white text-5xl md:text-7xl font-extrabold italic">
          JAYANETTHI BOOK STORE
        </h1>
        <h2 className="text-3xl md:text-5xl font-bold text-blue-700 animate-bounce-slow">
          A book can change your life 📚
        </h2>
      </div>
    </div>
  );
};

export default Home;
