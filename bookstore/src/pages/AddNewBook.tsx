import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';

const AddNewBook: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    quantity: '',
    price: '',
    description: '',
  });

  const [loading, setLoading] = useState(false);

  // ✅ handleChange stays here
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ handleSubmit goes here!
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const response = await fetch('http://localhost:5000/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        console.error('Backend error:', response.status, response.statusText);
        throw new Error('Failed to submit book');
      }
      
  
      const result = await response.json();
      console.log('Server response:', result);
      alert('Book added successfully!');
  
      setFormData({
        title: '',
        author: '',
        quantity: '',
        price: '',
        description: '',
      });
  
    } catch (error: unknown) {
      let errorMessage = 'Failed to add the book.';
  
      if (error instanceof Error) {
        console.error('Error:', error.message);
        errorMessage = error.message;
      } else {
        console.error('Unknown error:', error);
      }
  
      alert(errorMessage);
  
    } finally {
      setLoading(false);
    }
  };
  


  // ✅ JSX Return (Form and Button)
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Back button */}
      <button
        onClick={() => navigate('/admin/inventory')}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <IoArrowBack className="mr-2" size={24} />
        Back to Inventory
      </button>

      <h1 className="text-3xl font-bold text-center mb-8 text-red-600">Add New Book</h1>

      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block font-medium text-gray-700 mb-1">Book Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Author</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Quantity in Stock</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min={0}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Price (LKR)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min={0}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg transition ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {loading ? 'Submitting...' : 'Add Book'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewBook;
