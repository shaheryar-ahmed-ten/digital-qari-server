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
    picture: {
        type: mongoose.Schema.Types.Mixed,
    },
    gender: {
        type: String,
        required: [true, ERRORS.GENDER_REQUIRED]
    },
    parents_name: {
        type: String,
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
    },
    rating: {
        type: Number,
        default: 0
    },
    num_reviews: {
        type: Number,
        default: 0
    },
    card_token: {
        type: String
    }
}, {
    timestamps: true
});


function find_handler(next) {
    this.populate('payment_plan');
    this.populate('user');
    next();
}

student_schema.pre('find', find_handler);
student_schema.pre('findOne', find_handler);
student_schema.pre('findById', find_handler);

student_schema.post('save', function (error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
        next('Phone number already used');
    } else {
        next(error);
    }
});

let Student = mongoose.model(MODEL.STUDENT, student_schema, COLLECTION.STUDENTS);

module.exports = { Student };