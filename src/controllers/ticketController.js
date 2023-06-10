const Reservation = require('../models/reservation');
const Ticket = require('../models/ticket');

const ticketController = {
    createTicket: async (req, res) => {
        try {
          const { seatId, showtimeId, reservationId, price, room } = req.body;
      
          // check if seat and showtime exist
          const seatExists = await Seat.findById(seatId);
          const showtimeExists = await Showtime.findById(showtimeId);
          const reservationExists = await Reservation.findById(reservationId);
      
          if (!seatExists || !showtimeExists || !reservationExists) {
            return res.status(404).json({ error: 'Seat or Showtime or Reservation not found' });
          }
      
          // create new ticket
          const ticket = new Ticket({
            seatId,
            showtimeId,
            reservationId,
            price,
            room
          });
      
          await ticket.save();
      
          return res.status(201).json({ ticket });
        } catch (error) {
          return res.status(500).json({ error: error.message });
        }
    },

    
};

module.exports = ticketController;