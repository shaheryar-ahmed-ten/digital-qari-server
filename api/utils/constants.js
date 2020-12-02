module.exports.ERRORS = {
    MONGODB_CONNECTION_FAILED: "MongoDB connection failed",
    MONGODB_CONNECTION_SUCCESSFUL: "MongoDB connection successful",
    INVALID_EMAIL: "Invalid email",
    INVALID_PASSWORD: "Invalid password",
    INVALID_CREDENTIALS: "Invalid credentials",
    USER_NOT_FOUND: "User not found",
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
    PAYMENT_PLAN_REQUIRED: "Payment plan is required",
    PAYMENT_DUE_DATE_REQUIRED: "Payment due date is required",
    INVALID_PAYMENT_PLAN: "Invalid payment plan",
    QARI_REQUIRED: "Qari is required",
    STUDENT_REQUIRED: "Student is required",
    SESSION_START_TIME_REQUIRED: "Session start time is required",
    SESSION_END_TIME_REQUIRED: "Session end time is required",
    INVALID_OTP: "Invalid one-time passcode",
    USER_ALREADY_VERIFIED: "User is already verified"
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
    SESSION: "session"
};

module.exports.COLLECTION = {
    USERS: "users",
    ADMINS: "admins",
    INSTITUTES: "institutes",
    QARIS: "qaris",
    CLASSROOMS: "classrooms",
    STUDENTS: "students",
    BOOKINGS: "bookings",
    SESSIONS: "sessions"
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

module.exports.HEADERS = {
    X_AUTH_TOKEN: 'x-auth-token'
}

module.exports.EMAIL = {
    CHANGE_PASSWORD_EMAIL: (token) => {
        return {
            subject: "Digital Qari - Change Password",
            html: require("./email_templates/change_password.email").default(token)
        }
    }
}

module.exports.SMS = {
    OTP_SMS: (otp) => {
        return `OTP: ${otp}. This is your one-time passcode for DigitalQari to verify your account.`;
    }
}