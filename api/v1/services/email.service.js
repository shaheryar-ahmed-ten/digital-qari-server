const { TE } = require("../../utils/helpers");
const { transport_mail } = require("../../utils/nodemailer.transporter");

class EmailService {
  async send_mail(to, subject, html, attachments = []) {
    try {
      let info = await transport_mail({
          to,
          subject,
          html,
          attachments
      });

      return info;
    } catch (err) {
        TE(err);
    }
  }
}

module.exports = new EmailService();