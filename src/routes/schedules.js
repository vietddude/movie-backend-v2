const express = require('express');
const uploadMiddleware = require('../utils/uploadMiddleware');
const scheduleController = require('../controllers/scheduleController')
const auth = require('../middleware/auth')

const router = new express.Router();

router.post('/', auth.manager, scheduleController.addSchedule);
router.get('/search/', scheduleController.findTheatre);
router.get('/all', scheduleController.getAllSchedules);
router.get('/showtime/:showtimeId', scheduleController.getSchedulesByShowtime);
router.get('/theatre/', auth.manager, scheduleController.getScheduleByTheatre);
router.get('/:id', scheduleController.getByscheduleId);
router.get('/', scheduleController.getByShowtimeIdAndDate);
router.patch('/:id', auth.manager, scheduleController.updateById);
router.delete('/:id', auth.manager, scheduleController.deleteById);
router.post('/upload', auth.manager, uploadMiddleware, scheduleController.addScheduleFile);
router.get('/date-range/:showtimeId', auth.manager, scheduleController.getSchedulesByShowtime);

module.exports = router;