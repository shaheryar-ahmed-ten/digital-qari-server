var express = require('express');
var router = express.Router();

const {ReS, ReE, authenticate} = require("../../utils/helpers");
const {ERRORS, USER_ROLES} = require("../../utils/constants");

const QariService = require("../services/qari.service");

router.get('/', authenticate, async (req, res) => {
  try {
    if(req.auth.role != USER_ROLES.ADMIN) ReE(res, ERRORS.UNAUTHORIZED_USER, 401);
    else {
      let limit = ~~req.query.limit;
      let page = ~~req.query.page;
      let {documents: qaris, total_count} = await QariService.get_all(limit, page);
  
      ReS(res, {
        qaris,
        total_count
      });
    }
    
  } catch(err) {
    ReE(res, err);
  }
});

router.get('/:qari_id', authenticate, async (req, res) => {
  try {
    if(req.auth.role != USER_ROLES.ADMIN && req.auth.role_id != req.params.qari_id) ReE(res, ERRORS.UNAUTHORIZED_USER, 401);
    else {
      let qari = await QariService.find_by_id(req.params.qari_id);
      ReS(res, {
        qari
      });
    }
  } catch (err) {
    ReE(res, err);
  }
});

router.put('/:qari_id', authenticate, async (req, res) => {
  try {
    if(req.auth.role != USER_ROLES.ADMIN && req.auth.role_id != req.params.qari_id) ReE(res, ERRORS.UNAUTHORIZED_USER, 401);
    else {
      let qari = await QariService.update(req.auth.role_id, req.body);
      ReS(res, {
        qari
      });
    }
  } catch (err) {
    ReE(res, err);
  }
});


module.exports = router;