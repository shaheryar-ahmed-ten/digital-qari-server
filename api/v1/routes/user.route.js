var express = require('express');
var router = express.Router();

const passport = require("passport");

const { ReS, ReE, generate_token, send_token, authenticate, TE } = require("../../utils/helpers");
const { ERRORS, USER_ROLES, EMAIL } = require("../../utils/constants");

const UserService = require("../services/user.service");
const StudentService = require("../services/student.service");
const QariService = require("../services/qari.service");
const SESEmailSendService = require("../services/ses_email_send.service");

router.get('/', authenticate, async (req, res) => {
  try {
    if (req.auth.role != USER_ROLES.ADMIN) TE(ERRORS.UNAUTHORIZED_USER);
    else {
      let limit = ~~req.query.limit;
      let page = ~~req.query.page;
      let admins = await UserService.get_all(limit, page);

      ReS(res, {
        admins
      });
    }

  } catch (err) {
    ReE(res, err);
  }
});

router.get('/:user_id', authenticate, async (req, res) => {
  try {
    if (req.auth.id != req.params.user_id) TE(ERRORS.UNAUTHORIZED_USER);
    else {
      let user = await UserService.find_by_id(req.auth.id);
      ReS(res, {
        user
      });
    }
  } catch (err) {
    ReE(res, err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    let _user = {
      documents: []
    };
    switch (req.body.role) {
      case 'student':
        _user = await StudentService.find({ "phone_number": { "$regex": req.body.phone_number.slice(-10), "$options": "i" } })
        break;
      case 'qari':
        _user = await QariService.find({ "phone_number": { "$regex": req.body.phone_number.slice(-10), "$options": "i" } })
        break;
    }
    if (!_user.documents.length) {

      let user = await UserService.create(req.body, true);

      ReS(res, {
        user
      });
    } else {
      ReE(res, ERRORS.PHONE_NUMBER_NOT_UNIQUE)
    }
  } catch (err) {
    ReE(res, err);
  }
});

router.post('/login', async (req, res, next) => {
  passport.authenticate('user-local', { session: false }, async function (err, user, info) {
    if (err) ReE(res, err, 401);
    else if (info && info.error) ReE(res, info.error, 401);
    else {
      req.auth = {
        id: user.id,
        role: user.role,
        role_id: user.role_id,
        email: user.email,
        verified: user.verified
      }
      next();
    }
  })(req, res, next);
}, generate_token, send_token);

router.post('/:user_id/verify', authenticate, async (req, res) => {
  try {
    console.log(req.auth, req.params.user_id);
    if (req.auth.id != req.params.user_id) TE(ERRORS.UNAUTHORIZED_USER);
    let verified = await UserService.verify(req.params.user_id, req.body.otp);

    ReS(res, {
      verified
    });
  } catch (err) {
    ReE(res, err);
  }
});

router.post('/:user_id/resend_otp', authenticate, async (req, res) => {
  try {
    if (req.auth.id != req.params.user_id) TE(ERRORS.UNAUTHORIZED_USER);

    let resent_otp = await UserService.resend_otp(req.params.user_id, req.auth.role, req.auth.role_id);

    ReS(res, {
      resent_otp
    });
  } catch (err) {
    ReE(res, err);
  }
})

router.post('/change_password_request', async (req, res) => {
  try {
    const token = new Buffer(`${+new Date()}`).toString("base64");
    let { subject, html } = EMAIL.CHANGE_PASSWORD_EMAIL(token);

    await UserService.update_user_token(req.body.email, token);

    await SESEmailSendService.send_email(req.body.email, subject, html);

    ReS(res);
  } catch (err) {
    ReE(res, err);
  }
})

router.post('/change_password', async (req, res) => {
  try {
    let password_changed_successfully = await UserService.change_password(req.body.new_password, req.body.token);
    ReS(res, {
      password_changed_successfully
    });
  } catch (err) {
    ReE(res, err);
  }
});

router.post('/:user_id/change_password', authenticate, async (req, res) => {
  try {
    if (req.auth.id != req.params.user_id) TE(ERRORS.UNAUTHORIZED_USER);
    let password_changed_successfully = await UserService.change_password(req.body.new_password, null, req.params.user_id, req.body.old_password);
    ReS(res, {
      password_changed_successfully
    });
  } catch (err) {
    ReE(res, err);
  }
});

router.put('/:user_id/update_fcm_token', authenticate, async (req, res) => {
  try {
    if (req.auth.id != req.params.user_id) TE(ERRORS.UNAUTHORIZED_USER);

    let fcm_token_updated_successfully = await UserService.update_fcm_token(req.auth.id, req.body.fcm_token);
    ReS(res, {
      fcm_token_updated_successfully
    });
  } catch (err) {
    ReE(res, err);
  }
});

router.post('/:user_id/deactivate', authenticate, async (req, res) => {
  try {
    if (req.auth.role != USER_ROLES.ADMIN && req.auth.role != USER_ROLES.INSTITUTE) {
      TE(ERRORS.UNAUTHORIZED_USER);
    }

    if (req.auth.role == USER_ROLES.INSTITUTE) {
      let qari = await QariService.find_by_user_id(req.params.user_id);
      if (!qari || qari.institute != req.auth.role_id) {
        TE(ERRORS.UNAUTHORIZED_USER);
      }
    }

    let user_deactivated_successfully = await UserService.deactivate(req.params.user_id);
    ReS(res, {
      user_deactivated_successfully
    });
  } catch (err) {
    TE(err);
  }
});

router.post('/:user_id/activate', authenticate, async (req, res) => {
  try {
    if (req.auth.role != USER_ROLES.ADMIN && req.auth.role != USER_ROLES.INSTITUTE) {
      TE(ERRORS.UNAUTHORIZED_USER);
    }

    if (req.auth.role == USER_ROLES.INSTITUTE) {
      let qari = await QariService.find_by_user_id(req.params.user_id);
      if (!qari || qari.institute != req.auth.role_id) {
        TE(ERRORS.UNAUTHORIZED_USER);
      }
    }

    let user_activated_successfully = await UserService.activate(req.params.user_id);
    ReS(res, {
      user_activated_successfully
    });
  } catch (err) {
    TE(err);
  }
});

module.exports = router;
