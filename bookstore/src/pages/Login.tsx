import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);

      alert(response.data.message);

      // Save user data and token if returned
      const userData = response.data.user;
      localStorage.setItem('user', JSON.stringify(userData));

      console.log('Logged in user:', userData);

      // Redirect after successful login
      navigate('/dashboard');
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || 'Something went wrong');
      } else {
        alert('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-xl font-semibold text-center text-blue-700 mb-4">Login to Your Account</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-400 focus:border-blue-400 text-sm"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-400 focus:border-blue-400 text-sm"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 ${loading ? 'bg-gray-400' : 'bg-blue-500'} text-white rounded text-sm hover:bg-blue-600 transition`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-gray-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-500 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
