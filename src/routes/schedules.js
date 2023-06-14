const express = require('express');
const uploadMiddleware = require('../utils/uploadMiddleware');
const scheduleController = require('../controllers/scheduleController')
const auth = require('../middleware/auth')

const router = new express.Router();

router.post('/', scheduleController.addSchedule);
router.get('/search/', scheduleController.findTheatre);
router.get('/:id', scheduleController.getByscheduleId);
router.get('/', scheduleController.getByShowtimeIdAndDate);
router.patch('/:id', auth.manager, scheduleController.updateById);
router.delete('/:id', auth.manager, scheduleController.deleteById);
router.post('/upload', auth.manager, uploadMiddleware, scheduleController.addScheduleFile);

module.exports = router;