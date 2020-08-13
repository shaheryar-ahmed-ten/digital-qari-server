var express = require('express');
var router = express.Router();

const {ReS, ReE } = require("../../utils/helpers");
const EmailService = require("../services/email.service");

router.post('/', async(req, res) => {
  try {
    let emails = req.body.emails.split(",");
    let subject = req.body.subject;
    let message = req.body.message;
    let attachments = req.body.attachments ? req.body.attachments : [];

    for(let i in emails) {
      let email = emails[i];
      await EmailService.send_mail(email, subject, message, attachments);
    }

    ReS(res);
  } catch(err) {
    ReE(res, err);
  }
});

module.exports = router;