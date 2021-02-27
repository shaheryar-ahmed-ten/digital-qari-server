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
  qari_amount: {
    type: Number,
    required: true
  },
  student_amount: {

  },
  payment_plan: {
    type: mongoose.Types.ObjectId,
    ref: MODEL.PAYMENT_PLAN
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

function find_handler(next) {
  this.populate('qari');
  this.populate('student');
  next();
}

booking_schema.pre('find', find_handler);
booking_schema.pre('findOne', find_handler);
booking_schema.pre('findById', find_handler);

let Booking = mongoose.model(MODEL.BOOKING, booking_schema, COLLECTION.BOOKINGS);

module.exports = { Booking };