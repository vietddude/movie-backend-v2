const express = require('express');
const auth = require('../middleware/auth');
const reservationController = require('../controllers/reservationController');
const ticketController = require('../controllers/ticketController');
const router = new express.Router();

router.post('/', auth.user, reservationController.createReservation);
router.post('/:reservationId/book', auth.user, reservationController.bookReservation);
router.get('/ticket/:ticketId', auth.user, ticketController.getTicket);
router.get('/:reservationId/tickets', reservationController.getAllTicketsByReservationId);
// router.get('/', auth.simple, reservationController.getAllReservations);
// router.get('/:id', reservationController.getReservationById);
// router.get('/checkin/:id', reservationController.getReservationCheckinById);
// router.patch('/:id', auth.enhance, reservationController.updateReservationById);
// router.delete('/:id', auth.enhance, reservationController.deleteReservationById);


module.exports = router;