const express = require('express');
const scheduleController = require('../controllers/scheduleController')

const router = new express.Router();

router.post('/', scheduleController.addSchedule);
router.get('/:id', scheduleController.getByShowtimeId);
router.get('/', scheduleController.getByShowtimeIdAndDate);
router.patch('/:id', scheduleController.updateById);
router.delete('/:id', scheduleController.deleteById);

module.exports = router;