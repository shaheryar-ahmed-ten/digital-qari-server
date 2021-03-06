var express = require('express');
var router = express.Router();

const { ReS, ReE, authenticate, convert_to_object_id, TE } = require("../../utils/helpers");
const { ERRORS, USER_ROLES } = require("../../utils/constants");

const StudentService = require("../services/student.service");

router.get('/all', async (req, res) => {
  try {
    let institute = req.query.institute;
    const filters = {};
    if (institute) {
      filters['institute'] = convert_to_object_id(institute);
    }
    let { documents: students } = await StudentService.condensed_find({ ...filters });
    ReS(res, {
      students
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
    let referral_code = req.query.referral_code;
    const filters = {};
    if (name) {
      filters['name'] = new RegExp(name, "i");
    }
    if (institute) {
      filters['institute'] = convert_to_object_id(institute);
    }
    if (referral_code) {
      filters['referral_code'] = referral_code;
    }
    let { documents: students, total_count } = await StudentService.get_all({ ...filters }, limit, page);

    ReS(res, {
      students,
      total_count
    });
  } catch (err) {
    ReE(res, err);
  }
});

router.get('/:student_id', async (req, res) => {
  try {
    let student = await StudentService.find_by_id(req.params.student_id);
    ReS(res, {
      student
    });
  } catch (err) {
    ReE(res, err);
  }
});

router.get('/:student_id/payment_details', authenticate, async (req, res) => {
  try {
    if (req.auth.role != USER_ROLES.ADMIN && req.auth.role != USER_ROLES.INSTITUTE && req.auth.role_id != req.params.student_id) TE(ERRORS.UNAUTHORIZED_USER);

    let payment_details = await StudentService.get_payment_details(req.params.student_id);
    
    ReS(res, {
      payment_details
    })
  } catch (err) {
    ReE(res, err);
  }
})

router.put('/:student_id', authenticate, async (req, res) => {
  try {
    if (req.auth.role != USER_ROLES.ADMIN && req.auth.role != USER_ROLES.INSTITUTE && req.auth.role_id != req.params.student_id) TE(ERRORS.UNAUTHORIZED_USER);

    let student = await StudentService.update(req.params.student_id, req.body);
    ReS(res, {
      student
    });

  } catch (err) {
    ReE(res, err);
  }
});

module.exports = router;