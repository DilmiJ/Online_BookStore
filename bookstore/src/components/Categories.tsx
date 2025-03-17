import React from 'react';

const Categories: React.FC = () => {
  const categories = [
    { label: 'New Arrivals', icon: '🆕' },
    { label: 'Best Sellers', icon: '📈' },
    { label: 'Book Bundles', icon: '📚' },
    { label: 'Gift Cards', icon: '🎁' },
    { label: 'Deals', icon: '💰' },
    { label: 'Pre Orders', icon: '📝' },
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold mb-6">Browse by your favourite</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center p-4 bg-white rounded-lg shadow hover:shadow-lg transition"
            >
              <div className="text-4xl mb-2">{item.icon}</div>
              <div className="text-sm font-medium">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
