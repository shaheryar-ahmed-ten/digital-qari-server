const { User } = require("./user.model");
const { Admin } = require("./admin.model");
const { Institute } = require("./institute.model");
const { Qari } = require("./qari.model");
const { Student } = require("./student.model");
const { Booking } = require("./booking.model");
const { Session } = require("./session.model");

module.exports = {
    User,
    Admin,
    Institute,
    Qari,
    Student,
    Booking,
    Session
};