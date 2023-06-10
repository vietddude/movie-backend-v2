const mongoose = require('mongoose');

const { Schema } = mongoose;

const screenSchema = new Schema({
  scheduleId: {
    type: Schema.Types.ObjectId,
    ref: 'Schedule',
    required: true,
  },
  time: {
    type: String,
    required: true,
  },  
  seatArray: {
    type: [[Number]], // 2D array of numbers
    required: true,
  },
});

const Screen = mongoose.model('Screen', screenSchema);

module.exports = Screen;