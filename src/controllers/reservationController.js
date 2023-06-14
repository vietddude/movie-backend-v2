const Reservation = require('../models/reservation');
const Ticket = require('../models/ticket');
const BookedSeat = require('../models/bookedSeat');

const reservationController = {
  createReservation: async (req, res) => {
    try {
      // Validate the request body
      const { userId, showtimeId, seats, totalPrice } = req.body;
      const errors = [];
      if (!userId) {
        errors.push('userId is required');
      }
      if (!showtimeId) {
        errors.push('showtimeId is required');
      }
      if (!seats) {
        errors.push('seats is required');
      }
      if (!totalPrice) {
        errors.push('totalPrice is required');
      }

      // If there are any errors, return them to the client
      if (errors.length) {
        return res.status(400).json({ errors });
      }

      const expirationTime = new Date();
      expirationTime.setMinutes(expirationTime.getMinutes() + 10);

      // Create the reservation
      const reservation = new Reservation({
        userId,
        showtimeId,
        seats,
        totalPrice,
        expirationTime,
        status: 'Pending',
      });
      await reservation.save();

      // Prompt the user to pay for the reservation
      res.status(200).json(reservation);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  },

  bookReservation: async (req, res) => {
    try {
      const { reservationId } = req.params;
      const reservation = await Reservation.findById({ _id: reservationId });
      console.log(reservation.totalPrice);
      if (!reservation) {
        return res.status(404).json({ error: 'Reservation not found' });
      }

      // Calculate the expiration time for the QR code (e.g., 10 minutes from now)
      const now = new Date();
      if (now - reservation.expirationTime >= 10 * 60 * 1000) {
        for (const seat of reservation.seats) {
          await BookedSeat.findByIdAndDelete(seat._id);
        }
        await Reservation.findByIdAndUpdate(reservationId, { status: 'Canceled' });
        return res.status(400).json({ error: 'Reservation has expired' });
      }

      reservation.status = 'Booked';
      await reservation.save();

      const tickets = [];
      for (const seat of reservation.seats) {
        const price = seat.seatType == 1 ? 50000 : 100000;
        const ticket = new Ticket({
          reservationId: reservation._id,
          bookedSeatId: seat._id,
          room: 1,
          price: price
        });

        const row = String.fromCharCode(65 + seat.coordinate[0]);
        await ticket.save();
        tickets.push({ ...ticket._doc, position: row + seat.coordinate[1] });
      }
      res.status(200).json({ message: 'Reservation booked successfully', tickets });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  },

  getAllTicketsByReservationId: async (req, res) => {
    try {
      const reservationId = req.params;
      const tickets = await Ticket.find({ reservationId })
        .populate({
          path: 'reservationId',
          populate: [
            { path: 'movieId', select: 'name' },
            { path: 'screenId', select: 'date time' }
          ]
        })
        .populate('bookedSeatId', 'seatType coordinate');

      let totalPrice = 0;
      const formattedTickets = tickets.map((ticket) => {
        totalPrice += ticket.price;
        const { reservationId, price, bookedSeatId } = ticket;
        const { movieId, screenId } = ticket.reservationId;
        const { name } = movieId;
        const { date, time } = screenId;
        const [row, column] = bookedSeatId.coordinate;
        const seat = String.fromCharCode(65 + row) + column;

        return {
          reservationId,
          movie: name,
          date,
          time,
          price,
          seat
        };
      });

      const result = {
        reservationId,
        tickets: formattedTickets,
        totalPrice
      };

      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  },


  getAllReservations: async (req, res) => {
    try {
      const reservations = await Reservation.find({});
      res.status(200).json(reservations);
    } catch (e) {
      res.status(400).send(e);
    }
  },

  //     // Get reservation by id
  //     getReservationById: async (req, res) => {
  //         const _id = req.params.id;
  //         try {
  //             const reservation = await Reservation.findById(_id);
  //             return !reservation ? res.status(404).json({error: 'Reservation not found'}) : res.status(200).json(reservation);
  //         } catch (e) {
  //             return res.status(400).json({error: e.message});
  //         }
  //     },

  //     // Get reservation checkin by id
  //     getReservationCheckinById: async (req, res) => {
  //         const _id = req.params.id;
  //         try {
  //             const reservation = await Reservation.findById(_id);
  //             reservation.checkin = true;
  //             await reservation.save();
  //             return !reservation ? res.status(404).json({error: 'Reservation not found'}) : res.status(200).json(reservation);
  //         } catch (e) {
  //             return res.status(400).json({error: e.message});
  //         }
  //     },

  //   // Update reservation by id
  //     updateReservationById: async (req, res) => {
  //         const _id = req.params.id;
  //         const updates = Object.keys(req.body);
  //         const allowedUpdates = [
  //         'userId',
  //         'showtimeId',
  //         'originalPrice',
  //         'totalPrice'
  //         ];
  //         const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  //         if (!isValidOperation) return res.status(400).send({ error: 'Invalid updates!' });

  //         try {
  //             const reservation = await Reservation.findById(_id);
  //             updates.forEach((update) => (reservation[update] = req.body[update]));
  //             await reservation.save();
  //             return !reservation ? res.status(404).json({error: 'Reservation not found'}) : res.status(200).json(reservation);
  //         } catch (e) {
  //             return res.status(400).json({error: e.message});
  //         }
  //     },

  // Delete all reservations
  deleteAllReservations: async (req, res) => {
    try {
      await Reservation.deleteMany();
      res.status(200).json({ message: 'All reservations deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error deleting reservations' });
    }
  }


}

module.exports = reservationController;