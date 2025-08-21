const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { listInbox, listSent, sendMessage, markRead } = require('../controllers/messageController');

router.get('/inbox', protect, listInbox);
router.get('/sent', protect, listSent);
router.post('/', protect, sendMessage);
router.post('/:id/read', protect, markRead);

module.exports = router;


