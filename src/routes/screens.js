const express = require('express');

const ScreenController = require('../controllers/screenController');
// const auth = require('../middleware/auth');

const router = new express.Router();

router.post('/', ScreenController.createScreen);
router.get('/:id', ScreenController.getScreen);
router.get('/', ScreenController.getScreenBy);
router.patch('/:id', ScreenController.setBookedSeat);

module.exports = router;