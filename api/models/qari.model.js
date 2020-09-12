const mongoose = require('mongoose');
const { MODEL, COLLECTION, ERRORS } = require("../utils/constants");

let qari_schema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: MODEL.USER
    },
    institute: {
        type: mongoose.Types.ObjectId,
        ref: MODEL.INSTITUTE,
        required: [true, ERRORS.INSTITUTE_REQUIRED]
    },
    name: {
        type: String,
        required: [true, ERRORS.NAME_REQUIRED]
    },
    picture: {
        type: mongoose.Schema.Types.Mixed,
    },
    address: {
        type: String,
        required: [true, ERRORS.ADDRESS_REQUIRED]
    },
    phone_number: {
        type: String,
        unique: true,
        required: [true, ERRORS.PHONE_NUMBER_REQUIRED]
    },
    calendar: {
        type: Map,
        default: {}
    },
    fee: {
        type: Number,
        required: true,
    },
    fee_touched: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

function find_handler(next) {
    this.populate('institute');
    this.populate('user');
    next();
}

qari_schema.pre('find', find_handler);
qari_schema.pre('findOne', find_handler);
qari_schema.pre('findById', find_handler);


let Qari = mongoose.model(MODEL.QARI, qari_schema, COLLECTION.QARIS);

module.exports = { Qari };