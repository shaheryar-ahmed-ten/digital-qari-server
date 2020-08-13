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
    profile_picture: {
        type: String,
        required: [true, ERRORS.PROFILE_PICTURE_REQUIRED]
    },
    address: {
        type: String,
        required: [true, ERRORS.ADDRESS_REQUIRED]
    },
    phone_number: {
        type: String,
        required: [true, ERRORS.PHONE_NUMBER_REQUIRED]
    }
}, {
    timestamps: true
});

let Qari = mongoose.model(MODEL.QARI, qari_schema, COLLECTION.QARIS);

module.exports = { Qari };