const express = require('express');
// const auth = require('../middleware/auth');
const reservationController = require('../controllers/reservationController');
// const generateQR = require('../utils/generateQRCode');
const router = new express.Router();

router.post('/', reservationController.createReservation);
router.post('/:reservationId/book', reservationController.bookReservation);
// router.get('/', auth.simple, reservationController.getAllReservations);
// router.get('/:id', reservationController.getReservationById);
// router.get('/checkin/:id', reservationController.getReservationCheckinById);
// router.patch('/:id', auth.enhance, reservationController.updateReservationById);
// router.delete('/:id', auth.enhance, reservationController.deleteReservationById);


module.exports = router;