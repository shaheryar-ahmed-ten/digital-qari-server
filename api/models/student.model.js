const mongoose = require('mongoose');
const { MODEL, COLLECTION, ERRORS } = require("../utils/constants");

let student_schema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: MODEL.USER
    },
    name: {
        type: String,
        required: [true, ERRORS.NAME_REQUIRED]
    },
    phone_number: {
        type: String,
        unique: true,
        required: [true, ERRORS.PHONE_NUMBER_REQUIRED]
    },
    date_of_birth: {
        type: Date,
        required: [true, ERRORS.DATE_OF_BIRTH_REQUIRED]
    },
    gender: {
        type: String,
        required: [true, ERRORS.GENDER_REQUIRED]
    },
    parents_name: {
        type: String,
    },
    payment_plan: {
        type: mongoose.Types.ObjectId
    },
    payment_due_date: {
        type: Date
    },
    referral_code: {
        type: String,
        unique: true
    },
    reference: {
        type: {
            student_id: {
                type: mongoose.Types.ObjectId,
                ref: MODEL.STUDENT
            },
            discount: {
                type: Number
            }
        }
    },
    free_trials: {
        type: Number,
        default: 3
    }
}, {
    timestamps: true
});

student_schema.post('save', function (error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
        next('Phone number already used');
    } else {
        next(error);
    }
});

let Student = mongoose.model(MODEL.STUDENT, student_schema, COLLECTION.STUDENTS);

module.exports = { Student };