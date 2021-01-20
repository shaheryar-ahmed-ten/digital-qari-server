const mongoose = require('mongoose');
const { MODEL, COLLECTION, ERRORS } = require("../utils/constants");

let payment_plan_schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, ERRORS.PAYMENT_PLAN_NAME_REQUIRED]
    },
    frequency: {
        type: Number,
        required: [true, ERRORS.PAYMENT_PLAN_FREQUENCY_REQUIRED]
    }
}, {
    timestamps: true
});

let PaymentPlan = mongoose.model(MODEL.PAYMENT_PLAN, payment_plan_schema, COLLECTION.PAYMENT_PLANS);

module.exports = { PaymentPlan };