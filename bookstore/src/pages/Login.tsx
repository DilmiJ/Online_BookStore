import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios, { AxiosError } from 'axios';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: formData.email,
        password: formData.password,
      });

      const { user, message } = response.data;

      alert(message || 'Login successful!');

      localStorage.setItem('user', JSON.stringify(user));

      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error: unknown) {
      const err = error as AxiosError<{ message: string }>;

      if (err.response) {
        console.error('Server responded with:', err.response.data);
      } else if (err.request) {
        console.error('No response received:', err.request);
      } else {
        console.error('Error setting up request:', err.message);
      }

      const errorMessage =
        err.response?.data?.message ||
        'Login failed. Please check your credentials and try again.';
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-200">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm transform transition-all duration-500 hover:scale-[1.02]">
        <h2 className="text-3xl font-extrabold text-center text-blue-600 mb-8 drop-shadow-sm">
          Welcome Back!
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col space-y-1">
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              className="px-4 py-3 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm transition placeholder-gray-400 focus:placeholder-blue-300 bg-blue-50 hover:bg-blue-100"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              className="px-4 py-3 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm transition placeholder-gray-400 focus:placeholder-blue-300 bg-blue-50 hover:bg-blue-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white text-sm font-semibold transition-all duration-300 ${
              loading
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 hover:shadow-lg'
            }`}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don’t have an account?{' '}
          <Link
            to="/signup"
            className="text-blue-500 hover:underline hover:text-blue-600 transition"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
