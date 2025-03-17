import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Signup: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', formData);
      alert(response.data.message);
      navigate('/login');
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || 'Something went wrong');
      } else {
        alert('An unexpected error occurred');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-xl font-semibold text-center text-green-700 mb-4">Sign Up</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <label htmlFor="name" className="block text-xs font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-400 focus:border-green-400 text-sm"
            />
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-400 focus:border-green-400 text-sm"
            />
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-xs font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-400 focus:border-green-400 text-sm"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition"
          >
            Create Account
          </button>
        </form>

        {/* Link to Login */}
        <p className="mt-4 text-center text-xs text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-green-500 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
