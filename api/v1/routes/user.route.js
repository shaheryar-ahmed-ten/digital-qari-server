var express = require('express');
var router = express.Router();

const passport = require("passport");

const {ReS, ReE, generate_token, send_token, authenticate, convert_to_object_id} = require("../../utils/helpers");
const {ERRORS, USER_ROLES, EMAIL} = require("../../utils/constants");

const { transport_mail } = require("../../utils/nodemailer.transporter");

const UserService = require("../services/user.service");
const QariService = require("../services/qari.service");

router.get('/', authenticate, async (req, res) => {
  try {
    if(req.auth.role != USER_ROLES.ADMIN) ReE(res, ERRORS.UNAUTHORIZED_USER, 401);
    else {
      let limit = ~~req.query.limit;
      let page = ~~req.query.page;
      let admins = await UserService.get_all(limit, page);
  
      ReS(res, {
        admins
      });
    }
    
  } catch(err) {
    ReE(res, err);
  }
});

router.get('/:user_id', authenticate, async (req, res) => {
  try {
    if(req.auth.id != req.params.user_id) ReE(res, ERRORS.UNAUTHORIZED_USER, 401);
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
    let user = await UserService.create(req.body, true);
    ReS(res, {
      user
    });
  } catch(err) {
    ReE(res, err);
  }
});

router.post('/login', async (req, res, next) => {
  passport.authenticate('user-local', { session: false }, async function(err, user, info) {
    if(err) ReE(res, err, 401);
    else if(info && info.error) ReE(res, info.error, 401);
    else {
      req.auth = {
        id: user.id,
        role: user.role,
        role_id: user.role_id
      }
      next();
    }
  })(req, res, next);
}, generate_token, send_token);

router.post('/change_password_request', async(req, res) => {
  try {
    const token = new Buffer(`${+new Date()}`).toString("base64");
    let {subject, html} = EMAIL.CHANGE_PASSWORD_EMAIL(token);
    
    await UserService.update_user_token(req.body.email, token);

    await transport_mail({
        to: req.body.email,
        subject,
        html
    });

    ReS(res);
  } catch(err) {
    ReE(res, err);
  }
})

router.post('/change_password', async (req, res) => {
  try {
    let password_changed_successfully = await UserService.change_password(req.body.new_password, req.body.token);
    ReS(res, {
      password_changed_successfully
    });
  } catch(err) {
    ReE(res, err);
  }
});

router.post('/:user_id/change_password', authenticate, async (req, res) => {
  try {
    if(req.auth.id != req.params.user_id) ReE(res, ERRORS.UNAUTHORIZED_USER, 401);
    let password_changed_successfully = await UserService.change_password(req.body.new_password, null, req.params.user_id, req.body.old_password);
    ReS(res, {
      password_changed_successfully
    });
  } catch(err) {
    ReE(res, err);
  }
});

router.post('/:user_id/deactivate', authenticate, async (req, res) => {
  try {
    if(req.auth.role != USER_ROLES.ADMIN && req.auth.role != USER_ROLES.INSTITUTE) {
      ReE(res, ERRORS.UNAUTHORIZED_USER, 401);
    }

    if(req.auth.role == USER_ROLES.INSTITUTE) {
      let qari = await QariService.find_by_user_id(req.params.user_id);
      if(!qari || qari.institute != req.auth.role_id) {
        ReE(res, ERRORS.UNAUTHORIZED_USER, 401);
      }
    }

    let user_deactivated_successfully = await UserService.deactivate(req.params.user_id);
    ReS(res, {
      user_deactivated_successfully
    });
  } catch(err) {
    TE(err);
  }
});

router.post('/:user_id/activate', authenticate, async (req, res) => {
  try {
    if(req.auth.role != USER_ROLES.ADMIN && req.auth.role != USER_ROLES.INSTITUTE) {
      ReE(res, ERRORS.UNAUTHORIZED_USER, 401);
    }

    if(req.auth.role == USER_ROLES.INSTITUTE) {
      let qari = await QariService.find_by_user_id(req.params.user_id);
      if(!qari || qari.institute != req.auth.role_id) {
        ReE(res, ERRORS.UNAUTHORIZED_USER, 401);
      }
    }

    let user_activated_successfully = await UserService.activate(req.params.user_id);
    ReS(res, {
      user_activated_successfully
    });
  } catch(err) {
    TE(err);
  }
});

module.exports = router;
