const express = require('express');
const router = express.Router();
const Book = require('../models/Book'); 

router.post('/', async (req, res) => {
  try {
    const { title, author, quantity, price, description } = req.body;

    const newBook = new Book({ title, author, quantity, price, description });

    await newBook.save();

    res.status(201).json({ message: 'Book added successfully', book: newBook });
  } catch (error) {
    console.error('Failed to add book:', error.message);
    res.status(500).json({ message: 'Failed to add book', error: error.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books); // 
  } catch (error) {
    console.error('Failed to fetch books:', error.message);
    res.status(500).json({ message: 'Failed to fetch books', error: error.message });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const bookId = req.params.id;

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json(book);
  } catch (error) {
    console.error('Failed to get book:', error.message);
    res.status(500).json({ message: 'Failed to get book', error: error.message });
  }
});

router.put('/books/:id', async (req, res) => {
  const { id } = req.params;
  const { title, author, quantity, price, description } = req.body;

  try {
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { title, author, quantity, price, description },
      { new: true, runValidators: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found!' });
    }

    res.json(updatedBook);
  } catch (error) {
    console.error('Error updating book:', error.message);
    res.status(500).json({ message: 'Failed to update the book' });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const bookId = req.params.id;

    const deletedBook = await Book.findByIdAndDelete(bookId);

    if (!deletedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Failed to delete book:', error.message);
    res.status(500).json({ message: 'Failed to delete book', error: error.message });
  }
});

module.exports = router;
