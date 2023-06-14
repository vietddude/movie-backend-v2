const mongoose = require('mongoose');

const { Schema } = mongoose;

const ticketSchema = new Schema({
  reservationId: {
    type: Schema.Types.ObjectId,
    ref: 'Reservation',
    required: true,
  },
  bookedSeatId: {
    type: Schema.Types.ObjectId,
    ref: 'BookedSeat',
    required: true,
  },
  room: {
    type: Number,
    default: 1,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
},
  {
    timestamps: true,
  }
)

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;
