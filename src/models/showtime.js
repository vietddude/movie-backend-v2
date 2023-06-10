const mongoose = require('mongoose');

const { Schema } = mongoose;
const showtimeSchema = new Schema({
  url: {
    type: String,
    required: true,
    unique: true,
  },
  movieId: {
    type: Schema.Types.ObjectId,
    ref: 'Movie',
    required: true,
  },
  dateRange: {
    start: {
      type: Date,
      index: true,
    },
    end: {
      type: Date,
      index: true,
    },
  },
  isActive: {
    type: Boolean,
    default: true,
    required: true,
  }
});

const Showtime = mongoose.model('Showtime', showtimeSchema);

module.exports = Showtime;
