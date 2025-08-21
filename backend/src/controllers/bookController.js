const Book = require('../models/Book');
const { asyncHandler } = require('../utils/asyncHandler');
const { tryRespondWithMock } = require('../middleware/mockToggle');

const listBooks = asyncHandler(async (req, res) => {
  if (await tryRespondWithMock(req, res)) return;
  const books = await Book.find().sort({ createdAt: -1 });
  res.json(books);
});

const createBook = asyncHandler(async (req, res) => {
  if (await tryRespondWithMock(req, res)) return;
  const book = await Book.create(req.body);
  res.status(201).json(book);
});

const getBook = asyncHandler(async (req, res) => {
  if (await tryRespondWithMock(req, res)) return;
  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ message: 'Book not found' });
  res.json(book);
});

const updateBook = asyncHandler(async (req, res) => {
  if (await tryRespondWithMock(req, res)) return;
  const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!book) return res.status(404).json({ message: 'Book not found' });
  res.json(book);
});

const deleteBook = asyncHandler(async (req, res) => {
  if (await tryRespondWithMock(req, res)) return;
  const book = await Book.findByIdAndDelete(req.params.id);
  if (!book) return res.status(404).json({ message: 'Book not found' });
  res.json({ ok: true });
});

module.exports = { listBooks, createBook, getBook, updateBook, deleteBook };


