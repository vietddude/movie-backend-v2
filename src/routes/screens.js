const express = require('express');

const screenController = require('../controllers/screenController');
// const auth = require('../middleware/auth');

const router = new express.Router();

router.post('/', screenController.createScreen);
router.post('/booked-seat/:id', screenController.setBookedSeat);
router.delete('/booked-seat/:bookedSeatId', screenController.deleteBookedSeat);
router.get('/:id', screenController.getScreen);
router.get('/', screenController.getScreenBy);
router.delete('/:screenId', screenController.clearAllBookedSeatOfScreen);

module.exports = router;