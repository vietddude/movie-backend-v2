const express = require('express');

const screenController = require('../controllers/screenController');
const auth = require('../middleware/auth');

const router = new express.Router();

router.get('/', auth.user, screenController.getScreen);
router.get('/schedule-time/', auth.user, screenController.getScreenByScheduleIdAndTime);
router.post('/booked-seat/:screenId', auth.user, screenController.setBookedSeat);
router.delete('/booked-seat/:bookedSeatId', auth.user, screenController.deleteBookedSeat);
router.delete('/reset-seat/:screenId', auth.manager, screenController.resetSeatArray);
router.delete('/:screenId', auth.manager, screenController.clearAllBookedSeatOfScreen);

module.exports = router;