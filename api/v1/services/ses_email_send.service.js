const { TE } = require("../../utils/helpers");
const { send_email } = require("../../utils/ses.init");

class SESEmailSendService {
  async send_email(to, subject, body) {
    try {
      const data = await send_email(to, subject, body);
      
      return data;
    } catch(err) {
      TE(err);
    }
  }
}

module.exports = new SESEmailSendService();