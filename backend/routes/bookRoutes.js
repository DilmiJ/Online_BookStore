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

router.put('/:id', async (req, res) => {
  try {
    const bookId = req.params.id;

    const { title, author, quantity, price, description } = req.body;

    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      { title, author, quantity, price, description },
      { new: true } // Return the updated book
    );

    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json({ message: 'Book updated successfully', book: updatedBook });
  } catch (error) {
    console.error('Failed to update book:', error.message);
    res.status(500).json({ message: 'Failed to update book', error: error.message });
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
