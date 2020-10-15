var express = require('express');
var router = express.Router();

const {ReS, ReE, authenticate} = require("../../utils/helpers");
const {ERRORS, USER_ROLES} = require("../../utils/constants");

const ClassroomService = require("../services/classroom.service");

// router.post('/', authenticate, async (req, res) => {
router.post('/', async (req, res) => {
  try {
    // if(req.auth.role != USER_ROLES.QARI) ReE(res, ERRORS.UNAUTHORIZED_USER, 401);

    let classroom = await ClassroomService.create({
      // host: req.auth.id
      host: "5f357bfeebc6fc199202395e"
    });

    ReS(res, {
      classroom
    });

  } catch(err) {
    ReE(res, err, 422);
  }
});

module.exports = router;