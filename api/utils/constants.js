module.exports.ERRORS = {
    MONGODB_CONNECTION_FAILED: "MongoDB connection failed",
    MONGODB_CONNECTION_SUCCESSFUL: "MongoDB connection successful",
    INVALID_EMAIL: "Invalid email",
    INVALID_PASSWORD: "Invalid password",
    INVALID_CREDENTIALS: "Invalid credentials",
    USER_NOT_FOUND: "User not found",
    UNAUTHORIZED_USER: "User unauthorized",
    PASSWORDS_DONT_MATCH: "Passwords do not match",
    ACCOUNT_IS_LOCKED: "Account is locked",
    TOKEN_EXPIRED: "Token expired",
    EMAIL_REQUIRED: "Email is required",
    PASSWORD_REQUIRED: "Password is required",
    ROLE_REQUIRED: "Role is required"
};

module.exports.BCRYPT_SALT_WORK_FACTOR = 10;

module.exports.MODEL = {
    USER: "user",
    ADMIN: "admin",
};

module.exports.COLLECTION = {
    USERS: "users",
    ADMINS: "admins"
};

module.exports.REGEX = {
    EMAIL: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
};

module.exports.USER_ROLES = {
    ADMIN: "admin"
}

module.exports.EMAIL = {
    CHANGE_PASSWORD_EMAIL: (token) => {
        return {
            subject: "server-backend-boilerplate - Change Password",
            html: require("./email_templates/change_password.email").default(token)
        }
    }
}