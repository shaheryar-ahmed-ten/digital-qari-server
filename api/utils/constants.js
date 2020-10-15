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
    PASSWORD_REQUIRED: "Password is required",
    ROLE_REQUIRED: "Role is required",
    NAME_REQUIRED: "Name is required",
    ADDRESS_REQUIRED: "Address is required",
    PHONE_NUMBER_NOT_UNIQUE: "Phone number is not unique",
    PHONE_NUMBER_REQUIRED: "Phone number is required",
    PICTURE_REQUIRED: "Picture is required",
    INSTITUTE_REQUIRED: "Institute is required"
};

module.exports.BCRYPT_SALT_WORK_FACTOR = 10;

module.exports.MODEL = {
    USER: "user",
    ADMIN: "admin",
    INSTITUTE: "institute",
    QARI: "qari",
    CLASSROOM: "classroom"
};

module.exports.COLLECTION = {
    USERS: "users",
    ADMINS: "admins",
    INSTITUTES: "institutes",
    QARIS: "qaris",
    CLASSROOMS: "classrooms"
};

module.exports.REGEX = {
    EMAIL: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
};

module.exports.USER_ROLES = {
    ADMIN: "admin",
    INSTITUTE: "institute",
    QARI: "qari"
}

module.exports.SLOT_STATUS = {
    UNAVAILABLE: 0,
    AVAILABLE: 1,
    UNASSIGNED: 2
}

module.exports.EMAIL = {
    CHANGE_PASSWORD_EMAIL: (token) => {
        return {
            subject: "Digital Qari - Change Password",
            html: require("./email_templates/change_password.email").default(token)
        }
    }
}