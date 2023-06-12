const express = require('express');

const ScreenController = require('../controllers/screenController');
// const auth = require('../middleware/auth');

const router = new express.Router();

router.post('/', ScreenController.createScreen);
router.post('/booked-seat/:id', ScreenController.setBookedSeat);
router.delete('/booked-seat/:bookedSeatId', ScreenController.deleteBookedSeat);
router.get('/:id', ScreenController.getScreen);
router.get('/', ScreenController.getScreenBy);


module.exports = router;