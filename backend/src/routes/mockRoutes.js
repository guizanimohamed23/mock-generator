const router = require('express').Router();
const { protect, requireRoles } = require('../middleware/auth');
const { listMocks, createMock, updateMock, deleteMock, generateWithGemini, getOneMock } = require('../controllers/mockController');

router.get('/', protect, listMocks);
router.get('/one', protect, getOneMock);
router.post('/', protect, createMock);
router.put('/:id', protect, updateMock);
router.delete('/:id', protect, deleteMock);
router.post('/generate', protect, generateWithGemini);

module.exports = router;


