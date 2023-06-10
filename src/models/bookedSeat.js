const mongoose = require('mongoose');

const { Schema } = mongoose;

const bookedSeatSchema = new Schema({
  screenId: {
    type: Schema.Types.ObjectId,
    ref: 'Screen',
    required: true,
  },
  coordinate: {
    type: [Number],
    required: true,
  },
  seatType: {
    type: Number,
    enum: [1, 2],
    required: true
  }
});

const BookedSeat = mongoose.model('BookedSeat', bookedSeatSchema);

module.exports = BookedSeat;