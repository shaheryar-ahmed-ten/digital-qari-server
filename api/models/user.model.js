const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const { MODEL, COLLECTION, ERRORS, REGEX, SALT_WORK_FACTOR, USER_ROLES } = require("../utils/constants");

let user_schema = new mongoose.Schema({
    email: {
        type: String,
        validate: {
            validator: (v) => REGEX.EMAIL.test(v),
            message: props => `${ERRORS.INVALID_EMAIL}: ${props.value}`
        },
        required: [true, ERRORS.EMAIL_REQUIRED]
    },
    password: {
        type: String,
        required: [true, ERRORS.PASSWORD_REQUIRED]
    },
    role: {
        type: String,
        required: [true, ERRORS.ROLE_REQUIRED],
        enum: [...Object.values(USER_ROLES)]
    },
    active: {
        type: Boolean,
        default: true
    },
    token: {
        type: String,
        default: ""
    }
}, {
    timestamps: true
});

user_schema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

user_schema.methods.compare_password = function (candidate_password) {
    return bcrypt.compareSync(candidate_password, this.password);
};

let User = mongoose.model(MODEL.USER, user_schema, COLLECTION.USERS);

module.exports = { User };