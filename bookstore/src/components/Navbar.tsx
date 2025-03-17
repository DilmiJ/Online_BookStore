import React from 'react';

const Navbar: React.FC = () => {
  const categories = [
    'Best Sellers',
    'New Arrivals',
    'Deals',
    'Pre Orders',
    'Biographies',
    'Business',
    'Children',
    'Education',
    'Fiction',
  ];

  return (
    <nav className="bg-white border-b">
      <div className="container mx-auto px-4 py-2 flex space-x-6 text-sm justify-center">
        {categories.map((category, idx) => (
          <button key={idx} className="hover:text-blue-500">
            {category}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
