const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { listBooks, createBook, getBook, updateBook, deleteBook } = require('../controllers/bookController');

router.get('/', protect, listBooks);
router.post('/', protect, createBook);
router.get('/:id', protect, getBook);
router.put('/:id', protect, updateBook);
router.delete('/:id', protect, deleteBook);

module.exports = router;


