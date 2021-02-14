const mongoose = require('mongoose');
const { MODEL, COLLECTION } = require("../utils/constants");

let referral_schema = new mongoose.Schema({
  referrer: {
    type: mongoose.Types.ObjectId,
    ref: MODEL.STUDENT,
    required: true
  },
  referee: {
    type: mongoose.Types.ObjectId,
    ref: MODEL.STUDENT
  },
  referral_code: {
    type: String,
    required: true
  }
});

function find_handler(next) {
  this.populate('referrer');
  this.populate('referee');
  next();
}

referral_schema.pre('find', find_handler);
referral_schema.pre('findOne', find_handler);
referral_schema.pre('findById', find_handler);

let Referral = mongoose.model(MODEL.REFERRAL, referral_schema, COLLECTION.REFERRALS);

module.exports = { Referral };