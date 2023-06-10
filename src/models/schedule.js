const mongoose = require('mongoose');

const { Schema } = mongoose;

const scheduleSchema = new Schema({
  showtimeId: {
    type: Schema.Types.ObjectId,
    ref: 'Showtime',
    required: true,
  },
  date: {
    type: Date,
    required: true,
    index: true,
  },
  theatre: {
    type: String,
    required: true,
  },
  time: {
    type: [String],
    required: true,
  },  
});

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;