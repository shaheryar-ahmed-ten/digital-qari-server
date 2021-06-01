module.exports.ERRORS = {
    MONGODB_CONNECTION_FAILED: "MongoDB connection failed",
    MONGODB_CONNECTION_SUCCESSFUL: "MongoDB connection successful",

    INVALID_EMAIL: "Invalid email",
    INVALID_PASSWORD: "Invalid password",
    INVALID_CREDENTIALS: "Invalid credentials",
    INVALID_PAYMENT_PLAN: "Invalid payment plan",
    INVALID_OTP: "Invalid one-time passcode",
    INVALID_SLOT_STATUS: "Invalid slot status",
    INVALID_PAYMENT_PLAN: "Invalid payment plan",
    INVALID_BOT_VERIFICATION_CODE: "Invalid bot verification code",
    INVALID_REFERRAL_CODE: "Invalid referral code",

    USER_NOT_FOUND: "User not found",
    USER_ALREADY_VERIFIED: "User is already verified",
    UNAUTHORIZED_USER: "User unauthorized",
    
    PASSWORDS_DONT_MATCH: "Passwords do not match",
    ACCOUNT_IS_INACTIVE: "Account is inactive",
    TOKEN_EXPIRED: "Token expired",

    EMAIL_REQUIRED: "Email is required",
    EMAIL_NOT_UNIQUE: "Email is already used",
    PASSWORD_REQUIRED: "Password is required",
    ROLE_REQUIRED: "Role is required",
    NAME_REQUIRED: "Name is required",
    ADDRESS_REQUIRED: "Address is required",
    PHONE_NUMBER_NOT_UNIQUE: "Phone number is already used",
    PHONE_NUMBER_REQUIRED: "Phone number is required",
    PICTURE_REQUIRED: "Picture is required",
    INSTITUTE_REQUIRED: "Institute is required",
    DATE_OF_BIRTH_REQUIRED: "Date of birth is required",
    GENDER_REQUIRED: "Gender is required",
    
    PAYMENT_PLAN_NAME_REQUIRED: "Payment plan name is required",
    PAYMENT_PLAN_FREQUENCY_REQUIRED: "Payment plan frequency is required",
    PAYMENT_PLAN_RECURRENCE_REQUIRED: "Payment plan recurrence is required",
    PAYMENT_PLAN_REQUIRED: "Payment plan is required",
    PAYMENT_DUE_DATE_REQUIRED: "Payment due date is required",
    
    QARI_REQUIRED: "Qari is required",
    QARI_SLOT_REQUIRED: "Qari slot is required",
    QARI_SLOT_DAY_REQUIRED: "Qari slot day is required",
    QARI_SLOT_NUM_REQUIRED: "Qari slot number is required",
    STUDENT_REQUIRED: "Student is required",
    SESSION_START_TIME_REQUIRED: "Session start time is required",
    SESSION_END_TIME_REQUIRED: "Session end time is required",
    SESSION_REVIEW_RATING_REQURIED: "Session rating is required",
    SESSION_PEER_RATING_REQUIRED: "Peer rating is required",

    QARI_AMOUNT_REQUIRED: "Qari amount is required",
    STUDENT_AMOUNT_REQUIRED: "Student amount is required",

    BOOKING_REQUIRED: "Booking is required",
    TRANSACTION_AMOUNT_REQUIRED: "Transaction amount is required",
    PAYMENT_TYPE_REQUIRED: "Payment type is required",

    SLOTS_ALREADY_BOOKED: "The provided slot(s) have already been booked",
    SLOTS_DO_NOT_EXIST: "The provided slot(s) do not exist",

    QARI_ALREADY_BOOKED_ONCE: "A free trial session with this qari was already booked",

    FREE_TRIALS_FINISHED: "No more free trials available",
    FREE_TRIALS_DEADLINE_ENDED: "Your free trial availability deadline has ended",
    
    INVALID_SLOT_STATUS: "Invalid slot status",
    NOT_ALLOWED_IN_SESSION: "You are not authorized for this session",
    INVALID_SESSION: "Either this session is expired or you are not authorized",
};

module.exports.BCRYPT_SALT_WORK_FACTOR = 10;

module.exports.MODEL = {
    USER: "user",
    ADMIN: "admin",
    INSTITUTE: "institute",
    QARI: "qari",
    CLASSROOM: "classroom",
    STUDENT: "student",
    BOOKING: "booking",
    SESSION: "session",
    PAYMENT_PLAN: "payment_plan",
    REFERRAL: "referral",
    PAYMENT_TRANSACTION: "payment_transaction"
};

module.exports.COLLECTION = {
    USERS: "users",
    ADMINS: "admins",
    INSTITUTES: "institutes",
    QARIS: "qaris",
    CLASSROOMS: "classrooms",
    STUDENTS: "students",
    BOOKINGS: "bookings",
    SESSIONS: "sessions",
    PAYMENT_PLANS: "payment_plans",
    REFERRALS: "referrals",
    PAYMENT_TRANSACTIONS: "payment_transactions"
};

module.exports.REGEX = {
    EMAIL: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
};

module.exports.USER_ROLES = {
    ADMIN: "admin",
    INSTITUTE: "institute",
    QARI: "qari",
    STUDENT: "student"
}

module.exports.SLOT_STATUS = {
    UNAVAILABLE: 0,
    AVAILABLE: 1,
    UNASSIGNED: 2
}

module.exports.DAYS_OF_WEEK = {
    "Sunday": 0,
    "Monday": 1,
    "Tuesday": 2,
    "Wednesday": 3,
    "Thursday": 4,
    "Friday": 5,
    "Saturday": 6
}

module.exports.PAYMENT_PLANS = {
    "Quarterly": {
        payment_frequency: 3
    },
    "Bi-Annually": {
        payment_frequency: 6
    },
    "Annually": {
        payment_frequency: 12
    }
};

module.exports.SESSION_RECORDING_STATUS = {
    RECORDING_NOT_STARTED: 0,
    RECORDING_STARTED: 1,
    RECORDING_STOPPED: 2,
    RECORDING_FAILED: 3
}

module.exports.PAYMENT_STATUS = {
    PENDING: 0,
    PAID: 1,
    ACCRUED: 2
}

module.exports.PAYMENT_TYPE = {
    STUDENT_PAYMENT: 0,
    QARI_PAYMENT: 1
}

module.exports.SESSION_REVIEW_TYPE = {
    STUDENT_REVIEW: 0,
    QARI_REVIEW: 1
}

module.exports.HEADERS = {
    X_AUTH_TOKEN: 'x-auth-token'
}

module.exports.EMAIL = {
    CHANGE_PASSWORD_EMAIL: (token) => {
        return {
            subject: "Digital Qari - Change Password",
            html: require("./email_templates/change_password.email").default(token)
        }
    },
    WELCOME_EMAIL: (otp) => {
        return {
            subject: "Digital Qari - Welcome",
            html: require("./email_templates/welcome.email").default(otp)
        }
    },
    CONTACT_US_EMAIL: (email, number, message) => {
        return {
            subject: `Support requested from ${email}`,
            html: require("./email_templates/contact_us.email").default(email, number, message)
        }
    }
}

module.exports.SMS = {
    OTP_SMS: (otp) => {
        return `OTP: ${otp}. This is your one-time passcode for DigitalQari to verify your account.`;
    }
}