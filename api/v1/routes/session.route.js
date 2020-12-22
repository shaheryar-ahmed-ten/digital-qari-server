var express = require('express');
var router = express.Router();

const {ReS, ReE, authenticate} = require("../../utils/helpers");

const SessionService = require('../services/session.service');

router.get('/', authenticate, async (req, res) => {
  try {
    let { documents: sessions } = await SessionService.find({
      $or: [
        {
          qari: req.auth.role_id
        },
        {
          student: req.auth.role_id
        }
      ],
      free_trial: req.query.free_trials ? req.query.free_trials : false
    });

    ReS(res, {
      sessions
    });
  } catch (err) {
    ReE(res, err, 422);
  }
});

router.post('/:session_id/join', authenticate, async (req, res) => {
  try {
    let session = await SessionService.join(session_id, req.auth.role_id);

    ReS(res, {
      session
    });

  } catch(err) {
    ReE(res, err, 422);
  }
});

router.post('/:session_id/leave', authenticate, async (req, res) => {
  try {

  } catch(err) {
    ReE(res, err, 422);
  }
});

module.exports = router;