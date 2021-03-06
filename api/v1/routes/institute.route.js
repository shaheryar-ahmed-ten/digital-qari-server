var express = require('express');
var router = express.Router();

const {ReS, ReE, authenticate, TE} = require("../../utils/helpers");
const {ERRORS, USER_ROLES} = require("../../utils/constants");

const InstituteService = require("../services/institute.service");

router.get('/all', async (req, res) => {
  try {
    let { documents: institutes } = await InstituteService.condensed_find();
    ReS(res, {
      institutes
    });
  } catch(err) {
    ReE(res, err);
  }
});

router.get('/', async (req, res) => {
  try {
    let limit = ~~req.query.limit;
    let page = ~~req.query.page;
    let name = req.query.name;

    let {documents: institutes, total_count} = await InstituteService.get_all({
      name: new RegExp(name, "i")
    }, limit, page);

    ReS(res, {
      institutes,
      total_count
    });
  } catch(err) {
    ReE(res, err);
  }
});

router.get('/:institute_id', async (req, res) => {
  try {
    let institute = await InstituteService.find_by_id(req.params.institute_id);
    ReS(res, {
      institute
    });
  } catch (err) {
    ReE(res, err);
  }
});

router.put('/:institute_id', authenticate, async (req, res) => {
  try {
    if(req.auth.role != USER_ROLES.ADMIN && req.auth.role_id != req.params.institute_id) TE(ERRORS.UNAUTHORIZED_USER);
    else {
      let institute = await InstituteService.update(req.params.institute_id, req.body);
      ReS(res, {
        institute
      });
    }
  } catch (err) {
    ReE(res, err);
  }
});


module.exports = router;