var express = require('express');
var router = express.Router();

const {ReS, ReE, authenticate} = require("../../utils/helpers");

const SessionService = require('../services/session.service');

router.post('/:session_id/join', authenticate, async (req, res) => {
  try {
    let obj = {};

    obj.session_id = req.params.session_id;
    obj.user_id = req.auth.id;
    
    let session = await SessionService.create(obj);

    ReS(res, {
      session
    });

  } catch(err) {
    ReE(res, err, 422);
  }
});

module.exports = router;