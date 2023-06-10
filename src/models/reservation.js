const mongoose = require('mongoose');
const { Schema } = mongoose;

const reservationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  showtimeId: {
    type: Schema.Types.ObjectId,
    ref: 'Showtime',
    required: true
  },
  seats:
    {
      type: [Schema.Types.ObjectId],
      ref: 'BookedSeat',
      required: true
    },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    default: 'Pending',
    enum: ['Pending', 'Canceled', 'Booked'],
    required: true,
  },
  expirationTime: {
    type: Date
  }
}, {
  timestamps: true
});

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;