const mongoose = require('mongoose');
const { MODEL, COLLECTION, ERRORS } = require("../utils/constants");

let session_schema = new mongoose.Schema({
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
    start_time: {
        type: Date,
        required: [true, ERRORS.SESSION_START_TIME_REQUIRED]
    },
    end_time: {
        type: Date,
    },
    recording_link: {
        type: String
    },
    held: {
        type: Boolean,
        default: false
    },
    free_trial: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

session_schema.post('save', function (error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
        next('Phone number already used');
    } else {
        next(error);
    }
});

let Session = mongoose.model(MODEL.SESSION, session_schema, COLLECTION.SESSIONS);

module.exports = { Session };