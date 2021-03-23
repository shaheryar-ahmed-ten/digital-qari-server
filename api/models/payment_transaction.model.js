const mongoose = require('mongoose');
const { MODEL, COLLECTION, ERRORS, PAYMENT_TYPE } = require("../utils/constants");

let payment_transaction_schema = new mongoose.Schema({
  booking: {
    type: mongoose.Types.ObjectId,
    ref: MODEL.BOOKING,
    required: [true, ERRORS.BOOKING_REQUIRED]
  },
  amount: {
    type: Number,
    required: [true, ERRORS.TRANSACTION_AMOUNT_REQUIRED]
  },
  type: {
    type: String,
    enum: [...Object.values(PAYMENT_TYPE)],
    required: [true, ERRORS.PAYMENT_TYPE_REQUIRED]
  }
});

function find_handler(next) {
  this.populate('booking');
  next();
}

payment_transaction_schema.pre('find', find_handler);
payment_transaction_schema.pre('findOne', find_handler);
payment_transaction_schema.pre('findById', find_handler);

let PaymentTransaction = mongoose.model(MODEL.PAYMENT_TRANSACTION, payment_transaction_schema, COLLECTION.PAYMENT_TRANSACTIONS);

module.exports = { PaymentTransaction };