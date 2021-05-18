const mongoose = require('mongoose');
const { MODEL, PAYMENT_STATUS, COLLECTION, ERRORS } = require("../utils/constants");

let notification_logs_schema = new mongoose.Schema({
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
    title: {
        type: String,
    },
    body: {
        type: String,
    },
}, {
    timestamps: true
});

function find_handler(next) {
    this.populate('user');
    next();
}

notification_logs_schema.pre('find', find_handler);
notification_logs_schema.pre('findOne', find_handler);
notification_logs_schema.pre('findById', find_handler);

let Notification_logs = mongoose.model(MODEL.NOTIFICATION_LOG, notification_logs_schema, COLLECTION.NOTIFICATION_LOGS);

module.exports = { Notification_logs };