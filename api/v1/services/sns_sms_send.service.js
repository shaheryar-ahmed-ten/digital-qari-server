const { TE } = require("../../utils/helpers");
const { send_sms } = require("../../utils/sns.init");

class SNSSMSSendService {
  async send_sms(phone_number, message) {
    try {
      const data = await send_sms(phone_number, message);
      
      return data;
    } catch(err) {
      TE(err);
    }
  }
}

module.exports = new SNSSMSSendService();