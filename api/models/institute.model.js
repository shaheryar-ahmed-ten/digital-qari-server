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
    }
}, {
    timestamps: true
});

let Institute = mongoose.model(MODEL.INSTITUTE, institute_schema, COLLECTION.INSTITUTES);

module.exports = { Institute };