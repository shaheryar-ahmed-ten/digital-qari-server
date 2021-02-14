var express = require('express');
var router = express.Router();

const {ReS, ReE, authenticate, TE} = require("../../utils/helpers");
const {ERRORS, USER_ROLES} = require("../../utils/constants");

const ReferralService = require("../services/referral.service");

router.post('/', authenticate, async (req, res) => {
  try {
    if(req.auth.role == USER_ROLES.STUDENT && req.auth.role_id != req.body.referrer) TE(ERRORS.UNAUTHORIZED_USER);
    
    let referral = await ReferralService.create(req.body);

    ReS(res, {
      referral
    });
  } catch(err) {
    ReE(res, err);
  }
});

module.exports = router;