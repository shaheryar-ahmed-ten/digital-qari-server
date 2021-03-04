const mongoose = require('mongoose');
const { MODEL, COLLECTION, ERRORS, SESSION_RECORDING_STATUS, SESSION_REVIEW_TYPE } = require("../utils/constants");

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
    meeting_id: {
        type: String
    },
    recording_status: {
        type: Number,
        default: SESSION_RECORDING_STATUS.RECORDING_NOT_STARTED,
        required: true
    },
    recording_task_id: {
        type: String
    },
    recording_link: {
        type: String
    },
    free_trial: {
        type: Boolean,
        default: false
    },
    recording_bot_verification_code: {
        type: String
    },
    held: {
        type: Boolean,
        default: false
    },
    reviews: [{
        review_type: {
            type: Number,
            required: true,
            enum: [...Object.values(SESSION_REVIEW_TYPE)]
        },
        notes: {
            type: String
        },
        session_rating: {
            type: Number,
            required: [true, ERRORS.SESSION_REVIEW_RATING_REQURIED]
        },
        peer_rating: {
            type: Number,
            required: [true, ERRORS.SESSION_PEER_RATING_REQUIRED]
        }
    }]
}, {
    timestamps: true
});

function find_handler(next) {
    this.populate('qari');
    this.populate('student');
    this.sort({ start_time: -1 })
    next();
}

session_schema.pre('find', find_handler);

session_schema.post('save', function (error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
        next('Phone number already used');
    } else {
        next(error);
    }
});

let Session = mongoose.model(MODEL.SESSION, session_schema, COLLECTION.SESSIONS);

module.exports = { Session };