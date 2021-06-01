var express = require('express');
const { EMAIL } = require('../../utils/constants');
var router = express.Router();

const {ReS, ReE } = require("../../utils/helpers");
const SESEmailSendService = require("../services/ses_email_send.service");

router.post('/', async(req, res) => {
  try {
    let {email, number, message} = req.body;

    let {subject, html} = EMAIL.CONTACT_US_EMAIL(email, number, message);

    await SESEmailSendService.send_email(process.env.EMAIL, subject, html);
    await SESEmailSendService.send_email(email, subject, html);

    ReS(res);
  } catch(err) {
    ReE(res, err);
  }
});

module.exports = router;