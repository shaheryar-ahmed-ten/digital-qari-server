const mongoose = require('mongoose');
const { MODEL, PAYMENT_STATUS, COLLECTION, ERRORS } = require("../utils/constants");

let booking_schema = new mongoose.Schema({
  qari: {
    type: mongoose.Types.ObjectId,
    ref: MODEL.QARI,
    required: [true, ERRORS.QARI_REQUIRED]
  },
  student: {
    type: mongoose.Types.ObjectId,
    ref: MODEL.STUDENT,
    required: [true, ERRORS.STUDENT_REQUIRED]
  },
  qari_amount: {
    type: Number,
    required: [true, ERRORS.QARI_AMOUNT_REQUIRED]
  },
  student_amount: {
    type: Number,
    required: [true, ERRORS.STUDENT_AMOUNT_REQUIRED]
  },
  payment_plan: {
    type: mongoose.Types.ObjectId,
    ref: MODEL.PAYMENT_PLAN,
    required: [true, ERRORS.PAYMENT_PLAN_REQUIRED]
  },
  payment_due_date: {
      type: Date,
      required: [true, ERRORS.PAYMENT_DUE_DATE_REQUIRED]
  },
  payment_status: {
    type: Number,
    enum: [...Object.values(PAYMENT_STATUS)],
    default: PAYMENT_STATUS.PENDING
  },
});

function find_handler(next) {
  this.populate('qari');
  this.populate('student');
  this.populate('payment_plan');
  next();
}

booking_schema.pre('find', find_handler);
booking_schema.pre('findOne', find_handler);
booking_schema.pre('findById', find_handler);

let Booking = mongoose.model(MODEL.BOOKING, booking_schema, COLLECTION.BOOKINGS);

module.exports = { Booking };