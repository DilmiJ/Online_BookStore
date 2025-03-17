import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import { FaPlusCircle, FaEdit } from 'react-icons/fa';

const AdminInventory: React.FC = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate('/admin');
  };

  const goToAddNewBook = () => {
    navigate('/admin/inventory/add');
  };

  const goToManageInventory = () => {
    navigate('/admin/inventory/manage');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      
      <button
        onClick={goBack}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <IoArrowBack className="mr-2" size={24} />
        Back to Admin Dashboard
      </button>

      
      <h1 className="text-3xl font-bold text-center mb-10 text-red-600">
        Inventory Management
      </h1>

      
      <div className="flex flex-col md:flex-row justify-center items-center gap-10">
       
        <div
          onClick={goToAddNewBook}
          className="w-64 h-64 bg-white shadow-lg rounded-xl flex flex-col justify-center items-center cursor-pointer hover:shadow-2xl transition-transform transform hover:scale-105"
        >
          <FaPlusCircle className="text-green-600 mb-4" size={80} />
          <h2 className="text-xl font-semibold text-gray-800">Add New Book</h2>
        </div>

       
        <div
          onClick={goToManageInventory}
          className="w-64 h-64 bg-white shadow-lg rounded-xl flex flex-col justify-center items-center cursor-pointer hover:shadow-2xl transition-transform transform hover:scale-105"
        >
          <FaEdit className="text-blue-600 mb-4" size={80} />
          <h2 className="text-xl font-semibold text-gray-800">Update / Delete Book</h2>
        </div>
      </div>
    </div>
  );
};

export default AdminInventory;
