import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Sighnup';
import Dashboard from './pages/Dashboar'; // Confirm file name should be Dashboar or Dashboard
import Admin from './pages/Admin';
import AdminInventory from './pages/AdminInventory';
import AddNewBook from './pages/AddNewBook';
import BookManagement from './pages/BookManagement'; // Update & Delete page

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/inventory" element={<AdminInventory />} />
        <Route path="/admin/inventory/add" element={<AddNewBook />} />
        <Route path="/admin/inventory/update" element={<BookManagement />} />

        {/* Wildcard Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
