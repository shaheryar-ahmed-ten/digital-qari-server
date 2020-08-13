const nodemailer = require("nodemailer");

module.exports.transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

module.exports.transport_mail = this.transporter.sendMail.bind(this.transporter);