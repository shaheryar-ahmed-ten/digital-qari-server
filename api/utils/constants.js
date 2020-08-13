module.exports.ERRORS = {
    MONGODB_CONNECTION_FAILED: "MongoDB connection failed",
    MONGODB_CONNECTION_SUCCESSFUL: "MongoDB connection successful",
    INVALID_EMAIL: "Invalid email",
    INVALID_PASSWORD: "Invalid password",
    INVALID_CREDENTIALS: "Invalid credentials",
    INCOMPLETE_FIELDS: "Please fill all required fields",
    USER_NOT_FOUND: "User not found",
    UNAUTHORIZED_USER: "User unauthorized",
    RIDER_NOT_FREE: "Rider is not free",
    PASSWORDS_DONT_MATCH: "Passwords do not match",
    ACCOUNT_IS_LOCKED: "Account is locked",
    TOKEN_EXPIRED: "Token expired",
    COUNTRY_NOT_FOUND: "Country not found",
    STATE_NOT_FOUND: "State not found",
};

module.exports.BCRYPT_SALT_WORK_FACTOR = 10;

module.exports.MODEL = {
    USER: "user",
    ADMIN: "admin",
    RESTAURANT: "restaurant",
    RIDER: "rider",
    ORDER: "order",
    CITIES: "cities",
    COUNTRIES: "countries",
};

module.exports.COLLECTION = {
    USERS: "users",
    ADMINS: "admins",
    RESTAURANTS: "restaurants",
    RIDERS: "riders",
    ORDERS: "orders",
    CITIES: "cities"
};

module.exports.REGEX = {
    EMAIL: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
};

module.exports.ORDER_STATUS = {
    READY_FOR_PICKUP: "ready_for_pickup",
    PENDING_DELIVERY: "pending_delivery",
    DELIVERED: "delivered"
};

module.exports.USER_ROLES = {
    ADMIN: "admin",
    RESTAURANT: "restaurant",
    RIDER: "rider"
}

module.exports.EMAIL = {
    CHANGE_PASSWORD_EMAIL: (token) => {
        return {
            subject: "Pickngo - Change Password",
            html: require("./email_templates/change_password.email").default(token)
        }
    }
}