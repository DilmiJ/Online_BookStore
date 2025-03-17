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

  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const selectedFiles = Array.from(files).slice(0, 5); 
      setImages(selectedFiles);
      const urls = selectedFiles.map((file) => URL.createObjectURL(file));
      setPreviewUrls(urls);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (images.length < 1) {
      alert('Please upload at least one image.');
      return;
    }

    
    console.log('Form Data:', formData);
    console.log('Images:', images);

    alert('Book added successfully!');

    
    setFormData({
      title: '',
      author: '',
      quantity: '',
      price: '',
      description: '',
    });
    setImages([]);
    setPreviewUrls([]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      
      <button
        onClick={() => navigate('/admin/inventory')}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <IoArrowBack className="mr-2" size={24} />
        Back to Inventory
      </button>

      <h1 className="text-3xl font-bold text-center mb-8 text-red-600">Add New Book</h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg"
      >
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

          
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Upload Book Photos (1-5)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="w-full"
            />
            <div className="flex flex-wrap gap-4 mt-4">
              {previewUrls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-24 h-24 object-cover rounded border"
                />
              ))}
            </div>
          </div>

          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Add Book
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewBook;
