const { Referral } = require("../../models");
const { TE } = require("../../utils/helpers");
const CrudService = require("./crud.service");
const StudentService = require("./student.service");

const OTPGenerator = require('otp-generator');
const { ERRORS } = require("../../utils/constants");

class ReferralService extends CrudService {

  constructor() {
    super(Referral);
  }

  async create(obj, options) {
    let session;
    try {
      session = await Referral.startSession();

      await session.startTransaction();

      let referral = new Referral(obj);

      await referral.validate();

      let student = await StudentService.find_by_id(obj.referrer);
      if(!student) TE(ERRORS.USER_NOT_FOUND);

      console.log(student);

      if(student.referral_code !== obj.referral_code) TE(ERRORS.INVALID_REFERRAL_CODE);

      await referral.save({session});

      student.referral_code = OTPGenerator.generate(8, { upperCase: true, specialChars: false });

      await student.save({session});

      await session.commitTransaction();

      return referral;
    } catch(err) {
      await session.abortTransaction();
      TE(err);
    } finally {
      session.endSession();
    }
  }
}

module.exports = new ReferralService();