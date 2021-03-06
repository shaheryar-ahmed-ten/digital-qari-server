const { User } = require("./user.model");
const { Admin } = require("./admin.model");
const { Institute } = require("./institute.model");
const { Qari } = require("./qari.model");
const { Student } = require("./student.model");
const { Booking } = require("./booking.model");
const { Session } = require("./session.model");
const { PaymentPlan } = require("./payment_plan.model");
const { Referral } = require("./referral.model");
const { PaymentTransaction } = require("./payment_transaction.model");
const { Notification_logs } = require("./notification_log.model");

module.exports = {
    User,
    Admin,
    Institute,
    Qari,
    Student,
    Booking,
    Session,
    PaymentPlan,
    Referral,
    PaymentTransaction,
    Notification_logs
};