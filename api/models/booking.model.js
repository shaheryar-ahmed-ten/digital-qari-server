const mongoose = require('mongoose');
const { MODEL, COLLECTION } = require("../utils/constants");

let booking_schema = new mongoose.Schema({
  qari: {
    type: mongoose.Types.ObjectId,
    ref: MODEL.QARI
  },
  student: {
    type: mongoose.Types.ObjectId,
    ref: MODEL.STUDENT
  },
  amount: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

let Booking = mongoose.model(MODEL.BOOKING, booking_schema, COLLECTION.BOOKINGS);

module.exports = { Booking };