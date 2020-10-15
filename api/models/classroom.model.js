const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const { MODEL, COLLECTION, ERRORS, REGEX, SALT_WORK_FACTOR, USER_ROLES } = require("../utils/constants");

let classroom_schema = new mongoose.Schema({
    link: {
        type: String
    },
    host: {
        type: mongoose.Types.ObjectId,
        ref: MODEL.USER,
        required: true
    },
    students: {
        type: [mongoose.Types.ObjectId],
        default: []
    },
    room_id: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

let Classroom = mongoose.model(MODEL.CLASSROOM, classroom_schema, COLLECTION.CLASSROOMS);

module.exports = { Classroom };