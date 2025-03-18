import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Book {
  _id: string;
  title: string;
  author: string;
  quantity: number;
  price: number;
  description: string;
}

const BookManagement: React.FC = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/books');

      if (!res.ok) {
        throw new Error('Failed to fetch books');
      }

      const data = await res.json();
      setBooks(data);
    } catch (error: any) {
      alert(error.message || 'Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const deleteBook = async (bookId: string) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/books/${bookId}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Delete failed!');
      }

      alert('Book deleted successfully!');
      fetchBooks();
    } catch (error: any) {
      alert(error.message || 'Failed to delete the book.');
    }
  };

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">Manage Books</h1>

      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="Search by title or author..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading books...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto bg-white rounded shadow">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Author</th>
                <th className="px-4 py-2">Quantity</th>
                <th className="px-4 py-2">Price (LKR)</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    No books found
                  </td>
                </tr>
              ) : (
                filteredBooks.map((book) => (
                  <tr key={book._id} className="border-t text-center">
                    <td className="px-4 py-2">{book.title}</td>
                    <td className="px-4 py-2">{book.author}</td>
                    <td className="px-4 py-2">{book.quantity}</td>
                    <td className="px-4 py-2">{book.price}</td>
                    <td className="px-4 py-2 flex justify-center space-x-2">
                      
                      <button
                        onClick={() => navigate(`/admin/inventory/update/${book._id}`)}
                        className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => deleteBook(book._id)}
                        className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BookManagement;
