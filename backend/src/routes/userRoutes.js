const router = require('express').Router();
const { protect, requireRoles } = require('../middleware/auth');
const { listUsers, getUser, createUser, updateUser, deleteUser } = require('../controllers/userController');

router.get('/', protect, listUsers);
router.get('/:id', protect, getUser);
router.post('/', protect, requireRoles(['Backend', 'QA']), createUser);
router.put('/:id', protect, requireRoles(['Backend', 'QA']), updateUser);
router.delete('/:id', protect, requireRoles(['Backend', 'QA']), deleteUser);

module.exports = router;


