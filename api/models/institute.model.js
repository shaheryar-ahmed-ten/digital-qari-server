const mongoose = require('mongoose');
const { MODEL, COLLECTION, ERRORS } = require("../utils/constants");

let institute_schema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: MODEL.USER
    },
    name: {
        type: String,
        required: [true, ERRORS.NAME_REQUIRED]
    },
    address: {
        type: String,
        required: [true, ERRORS.ADDRESS_REQUIRED]
    },
    base_fee: {
        type: Number
    }
}, {
    timestamps: true
});

function find_handler(next) {
    this.populate('user');
    next();
}

institute_schema.pre('find', find_handler);
institute_schema.pre('findOne', find_handler);
institute_schema.pre('findById', find_handler);

let Institute = mongoose.model(MODEL.INSTITUTE, institute_schema, COLLECTION.INSTITUTES);

module.exports = { Institute };