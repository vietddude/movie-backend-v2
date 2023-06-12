const express = require('express');
// const auth = require('../middleware/auth');
const reservationController = require('../controllers/reservationController');
const ticketController = require('../controllers/ticketController');
const router = new express.Router();

router.post('/', reservationController.createReservation);
router.post('/:reservationId/book', reservationController.bookReservation);
router.get('/ticket/:ticketId', ticketController.getTicket);
// router.get('/', auth.simple, reservationController.getAllReservations);
// router.get('/:id', reservationController.getReservationById);
// router.get('/checkin/:id', reservationController.getReservationCheckinById);
// router.patch('/:id', auth.enhance, reservationController.updateReservationById);
// router.delete('/:id', auth.enhance, reservationController.deleteReservationById);


module.exports = router;