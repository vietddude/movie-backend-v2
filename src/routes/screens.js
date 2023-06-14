const express = require('express');

const screenController = require('../controllers/screenController');
const auth = require('../middleware/auth');

const router = new express.Router();

router.post('/booked-seat/:id', auth.user, screenController.setBookedSeat);
router.delete('/booked-seat/:bookedSeatId', auth.user, screenController.deleteBookedSeat);
router.delete('/reset-seat/:screenId', auth.manager, screenController.resetSeatArray);
router.get('/', auth.user, screenController.getScreen);
router.delete('/:screenId', auth.manager, screenController.clearAllBookedSeatOfScreen);

module.exports = router;