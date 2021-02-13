const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const { MODEL, COLLECTION, ERRORS, REGEX, SALT_WORK_FACTOR, USER_ROLES } = require("../utils/constants");

let user_schema = new mongoose.Schema({
    email: {
        type: String,
        lowercase:true,
        validate: {
            validator: (v) => REGEX.EMAIL.test(v),
            message: props => `${ERRORS.INVALID_EMAIL}: ${props.value}`
        },
        required: [true, ERRORS.EMAIL_REQUIRED],
        unique: true,
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
    },
    otp: {
        type: String
    },
    verified: {
        type: Boolean,
        default: false
    },
    fcm_token: {
        type: String
    }
}, {
    timestamps: true
});

user_schema.post('save', function(error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
        next('Email already used');
    } else {
        next(error);
    }
});

user_schema.pre('save', function (next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function (err, hash) {
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