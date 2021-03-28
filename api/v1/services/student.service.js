const { Student, Booking } = require("../../models");
const { TE } = require("../../utils/helpers");

const UserRoleService = require("./user_role.service");

const OTPGenerator = require('otp-generator');
const PaymentTransactionService = require("./payment_transaction.service");
const { PAYMENT_TYPE } = require("../../utils/constants");

class StudentService extends UserRoleService {
    constructor() {
        super(Student);
    }

    async create(obj, options) {
        try {
            obj.referral_code = OTPGenerator.generate(8, { upperCase: true, specialChars: false });
            if(obj.reference) {
                obj.reference = {
                    student_id: obj.reference,
                    discount: 0
                }
            } 

            return super.create(obj, options);
        } catch(err) {
            TE(err);
        }
    }

    async get_payment_details(student_id) {
        try {
            let bookings = await Booking.find({
                student: student_id
            });

            console.log(bookings);

            let {documents: payment_transactions} = await PaymentTransactionService.find({
                booking: bookings.map(booking => booking._id),
                type: PAYMENT_TYPE.STUDENT_PAYMENT
            });

            return {
                bookings,
                payment_transactions
            };
        } catch (err) {
            TE(err);
        }
    }
}

module.exports = new StudentService();