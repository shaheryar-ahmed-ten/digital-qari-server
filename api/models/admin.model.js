const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const { MODEL, COLLECTION, ERRORS, REGEX, SALT_WORK_FACTOR } = require("../utils/constants");

let admin_schema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: MODEL.USER
    }
}, {
    timestamps: true
});

let Admin = mongoose.model(MODEL.ADMIN, admin_schema, COLLECTION.ADMINS);

module.exports = { Admin };