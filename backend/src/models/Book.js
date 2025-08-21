const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    isbn: { type: String, required: true, unique: true },
    description: { type: String },
    publishedYear: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Book', BookSchema);


