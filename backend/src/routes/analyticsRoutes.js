const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { overview, activityOverTime } = require('../controllers/analyticsController');

router.get('/overview', protect, overview);
router.get('/activity', protect, activityOverTime);

module.exports = router;


