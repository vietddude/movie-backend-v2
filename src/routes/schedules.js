const express = require('express');
const uploadMiddleware = require('../utils/uploadMiddleware');
const scheduleController = require('../controllers/scheduleController')

const router = new express.Router();

router.post('/', scheduleController.addSchedule);
router.get('/search/', scheduleController.findTheatre);
router.get('/:id', scheduleController.getByscheduleId);
router.get('/', scheduleController.getByscheduleIdAndDate);
router.patch('/:id', scheduleController.updateById);
router.delete('/:id', scheduleController.deleteById);
router.post('/upload', uploadMiddleware, scheduleController.addScheduleFile);

module.exports = router;