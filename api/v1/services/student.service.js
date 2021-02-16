const { Student } = require("../../models");
const { TE } = require("../../utils/helpers");

const UserRoleService = require("./user_role.service");

const OTPGenerator = require('otp-generator');

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
}

module.exports = new StudentService();