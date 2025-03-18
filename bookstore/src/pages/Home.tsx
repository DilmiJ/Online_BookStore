import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaUserAlt, FaShoppingCart } from 'react-icons/fa';

interface Book {
  _id: string;
  title: string;
  author: string;
  quantity: number;
  price: number;
  description: string;
}

const Home: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState<Book[]>([]); 

  // Fetch books from the backend
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/books');
      const data = await res.json();

      if (res.ok) {
        const fetchedBooks = data.books || data;
        setBooks(fetchedBooks);
      } else {
        console.error('Error fetching books:', data.message);
      }
    } catch (error) {
      console.error('Failed to fetch books:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load cart items from localStorage when page loads
  useEffect(() => {
    fetchBooks();

    const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(storedCart);
  }, []);

  // Handle adding a book to the cart
  const handleAddToCart = (book: Book) => {
    
    const isAlreadyInCart = cartItems.find((item) => item._id === book._id);

    let updatedCart;

    if (isAlreadyInCart) {
      alert('This book is already in your cart!');
      return;
    } else {
      updatedCart = [...cartItems, book];
    }

    
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative min-h-screen bg-gradient-to-r from-blue-100 to-blue-300 p-4">

      {/* Top Right Buttons: Login and Cart */}
      <div className="absolute top-6 right-6 flex space-x-4">

        {/* Cart Icon */}
        <Link to="/cart"> {/* you can create a /cart route later */}
          <div className="relative">
            <FaShoppingCart className="text-3xl text-white cursor-pointer hover:text-yellow-300" />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5">
                {cartItems.length}
              </span>
            )}
          </div>
        </Link>

        {/* Login Button */}
        <Link to="/login">
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            <FaUserAlt />
            <span>Login</span>
          </button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="flex justify-center mt-16">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 rounded-full border border-gray-300 shadow-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
          <FaSearch className="absolute top-1/2 right-4 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Title Section */}
      <div className="text-center mt-8">
        <h1 className="text-5xl md:text-7xl font-extrabold italic text-white">
          JAYANETTHI BOOK STORE
        </h1>
        <h2 className="text-3xl md:text-5xl font-bold text-blue-700 mt-4 animate-bounce-slow">
          A book can change your life 📚
        </h2>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <p className="text-center mt-10 text-lg text-gray-600">Loading books...</p>
      )}

      {/* Book List */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-12 max-w-7xl mx-auto">
          {filteredBooks.length === 0 ? (
            <p className="text-center text-gray-700 col-span-full">No books found</p>
          ) : (
            filteredBooks.map((book) => (
              <div
                key={book._id}
                className="bg-white rounded-2xl shadow-md p-4 transform transition hover:scale-105 flex flex-col justify-between"
              >
                {/* Book Cover (Placeholder) */}
                <div className="flex justify-center items-center h-48 bg-gray-100 rounded-xl mb-4">
                  <span className="text-6xl">📚</span>
                </div>

                {/* Book Info */}
                <h3 className="text-lg font-semibold text-gray-800">{book.title}</h3>
                <p className="text-gray-600">By {book.author}</p>
                <p className="text-gray-700 mt-2">Price: LKR {book.price}</p>
                <p className="text-gray-700">In Stock: {book.quantity}</p>
                <p className="text-gray-500 mt-2 text-sm">{book.description}</p>

                {/* Buttons */}
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => handleAddToCart(book)}
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                  >
                    Add to Cart
                  </button>

                  <Link to={`/book/${book._id}`}> {/* Optional: view single book details */}
                    <button className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">
                      View
                    </button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
