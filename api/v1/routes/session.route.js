var express = require('express');
var router = express.Router();

const {ReS, ReE, authenticate} = require("../../utils/helpers");

const SessionService = require('../services/session.service');

router.get('/', authenticate, async (req, res) => {
  try {
    let filters = {};
    filters['$or'] =[
      {
        qari: req.auth.role_id
      },
      {
        student: req.auth.role_id
      }
    ];
    if(req.query.free_trials) {
      filters['free_trial'] = req.query.free_trials;
    }
    let { documents: sessions } = await SessionService.find(filters);

    ReS(res, {
      sessions
    });
  } catch (err) {
    ReE(res, err);
  }
});

router.post('/:session_id/join', authenticate, async (req, res) => {
  try {
    let session = await SessionService.join(req.params.session_id, req.auth.role_id);

    ReS(res, {
      session
    });

  } catch(err) {
    ReE(res, err);
  }
});

router.post('/:session_id/leave', authenticate, async (req, res) => {
  try {
    let session = await SessionService.leave(req.params.session_id);

    ReS(res, {
      session
    });

  } catch(err) {
    ReE(res, err);
  }
});

router.post('/:session_id/join_recording_bot', async (req, res) => {
  try {
    let verification_successful = await SessionService.join_recording_bot_code(req.params.session_id, req.body.recording_bot_verification_code);

    ReS(res, {
      verification_successful
    });

  } catch(err) {
    ReE(res, err);
  }
});

module.exports = router;