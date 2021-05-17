var express = require('express');
var router = express.Router();

const { ReS, ReE, authenticate, convert_to_object_id, TE } = require("../../utils/helpers");
const { ERRORS, USER_ROLES } = require("../../utils/constants");

const QariService = require("../services/qari.service");

router.get('/all', async (req, res) => {
  try {
    let institute = req.query.institute;
    const filters = {};
    if (institute) {
      filters['institute'] = convert_to_object_id(institute);
    }
    let { documents: qaris } = await QariService.condensed_find({ ...filters }, req.query.tz_offset);
    ReS(res, {
      qaris
    });
  } catch (err) {
    ReE(res, err);
  }
});

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
    let qari = await QariService.find_by_id(req.params.qari_id, req.query.tz_offset);
    ReS(res, {
      qari
    });
  } catch (err) {
    ReE(res, err);
  }
});

router.get('/:qari_id/students', authenticate, async (req, res) => {
  try {
    let { students } = await QariService.get_students(req.params.qari_id);

    ReS(res, {
      students
    })
  } catch (err) {
    ReE(res, err);
  }
});

router.put('/:qari_id', authenticate, async (req, res) => {
  try {
    if (req.auth.role != USER_ROLES.ADMIN && req.auth.role != USER_ROLES.INSTITUTE && req.auth.role_id != req.params.qari_id) TE(ERRORS.UNAUTHORIZED_USER);
    let oldQari = await QariService.find_by_id(req.params.qari_id);
    if (req.auth.role == USER_ROLES.INSTITUTE) {
      if (!oldQari || oldQari.institute._id != req.auth.role_id) {
        TE(ERRORS.UNAUTHORIZED_USER);
      }
    }

    let qari = req.body;
    if (qari.fee !== oldQari.fee) qari.fee_touched = true;

    qari = await QariService.update(req.params.qari_id, qari);
    ReS(res, {
      qari
    });

  } catch (err) {
    ReE(res, err);
  }
});

router.post('/:qari_id/assign_slot', authenticate, async (req, res) => {
  try {
    if (req.auth.role != USER_ROLES.ADMIN && req.auth.role != USER_ROLES.INSTITUTE && req.auth.role_id != req.params.qari_id) {
      TE(ERRORS.UNAUTHORIZED_USER);
    }

    if (req.auth.role == USER_ROLES.INSTITUTE) {
      let qari = await QariService.find_by_id(req.params.qari_id);
      if (!qari || qari.institute._id != req.auth.role_id) {
        TE(ERRORS.UNAUTHORIZED_USER);
      }
    }

    let slot_day = req.body.slot_day;
    let slot_num = req.body.slot_num;
    let status = req.body.status;

    let qari = await QariService.assign_slot(req.params.qari_id, slot_day, slot_num, status);
    ReS(res, {
      qari
    });
  } catch (err) {
    ReE(res, err);
  }
});

module.exports = router;