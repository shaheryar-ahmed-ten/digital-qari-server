var express = require('express');
var router = express.Router();

const {ReS, ReE, authenticate} = require("../../utils/helpers");
const {ERRORS, USER_ROLES} = require("../../utils/constants");

const InstituteService = require("../services/institute.service");

router.get('/', authenticate, async (req, res) => {
  try {
    if(req.auth.role != USER_ROLES.ADMIN) ReE(res, ERRORS.UNAUTHORIZED_USER, 401);
    else {
      let limit = ~~req.query.limit;
      let page = ~~req.query.page;
      let {documents: institutes, total_count} = await InstituteService.get_all(limit, page);
  
      ReS(res, {
        institutes,
        total_count
      });
    }
    
  } catch(err) {
    ReE(res, err);
  }
});

router.get('/:institute_id', authenticate, async (req, res) => {
  try {
    if(req.auth.role != USER_ROLES.ADMIN && req.auth.role_id != req.params.institute_id) ReE(res, ERRORS.UNAUTHORIZED_USER, 401);
    else {
      let institute = await InstituteService.find_by_id(req.params.institute_id);
      ReS(res, {
        institute
      });
    }
  } catch (err) {
    ReE(res, err);
  }
});

router.put('/:institute_id', authenticate, async (req, res) => {
  try {
    if(req.auth.role != USER_ROLES.ADMIN && req.auth.role_id != req.params.institute_id) ReE(res, ERRORS.UNAUTHORIZED_USER, 401);
    else {
      let institute = await InstituteService.update(req.auth.role_id, req.body);
      ReS(res, {
        institute
      });
    }
  } catch (err) {
    ReE(res, err);
  }
});


module.exports = router;