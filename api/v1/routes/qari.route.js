var express = require('express');
var router = express.Router();

const { ReS, ReE, authenticate, convert_to_object_id } = require("../../utils/helpers");
const { ERRORS, USER_ROLES } = require("../../utils/constants");

const QariService = require("../services/qari.service");

router.get('/', async (req, res) => {
  try {
    let limit = ~~req.query.limit;
    let page = ~~req.query.page;
    let name = req.query.name;
    let institute = req.query.institute;
    const filters = {};
    if (name) {
      filters['name'] = new RegExp(name, "i");
    }
    if (institute) {
      filters['institute'] = convert_to_object_id(institute);
    }
    let { documents: qaris, total_count } = await QariService.get_all({ ...filters }, limit, page);

    ReS(res, {
      qaris,
      total_count
    });
  } catch (err) {
    ReE(res, err);
  }
});

router.get('/:qari_id', async (req, res) => {
  try {
    let qari = await QariService.find_by_id(req.params.qari_id);
    ReS(res, {
      qari
    });
  } catch (err) {
    ReE(res, err);
  }
});

router.put('/:qari_id', authenticate, async (req, res) => {
  try {
    if (req.auth.role != USER_ROLES.ADMIN && req.auth.role_id != req.params.qari_id) ReE(res, ERRORS.UNAUTHORIZED_USER, 401);
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