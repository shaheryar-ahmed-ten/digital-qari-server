var express = require('express');
var router = express.Router();

const {ReS, ReE, authenticate} = require("../../utils/helpers");
const {ERRORS, USER_ROLES} = require("../../utils/constants");

const BookingService = require("../services/booking.service");

router.post('/', authenticate, async (req, res) => {
  try {
    let obj = req.body;

    if(req.auth.role == USER_ROLES.STUDENT && req.auth.role_id != req.body.student_id) TE(ERRORS.UNAUTHORIZED_USER);
    if(req.auth.role == USER_ROLES.ADMIN) obj.is_admin = true;
    
    let {booking} = await BookingService.create(req.body);

    ReS(res, {
      booking
    });

  } catch(err) {
    ReE(res, err, 422);
  }
});

module.exports = router;