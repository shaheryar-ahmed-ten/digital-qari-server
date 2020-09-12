var express = require('express');
var router = express.Router();

const {ReS, ReE, authenticate} = require("../../utils/helpers");
const {ERRORS, USER_ROLES} = require("../../utils/constants");

const ReportService = require("../services/report.service");
const QariService = require("../services/qari.service");

router.get('/calendar', authenticate, async (req, res) => {
  try {
    let institute_id = req.query.institute;
    let qari_id = req.query.qari;

    let report;
    
    if(qari_id) {
      if(req.auth.role != USER_ROLES.ADMIN && req.auth.role != USER_ROLES.INSTITUTE && req.auth.role_id != qari_id) {
        ReE(res, ERRORS.UNAUTHORIZED_USER, 401);
      }
  
      if(req.auth.role == USER_ROLES.INSTITUTE) {
        let qari = await QariService.find_by_id(qari_id);
        if(!qari || qari.institute._id != req.auth.role_id) {
          ReE(res, ERRORS.UNAUTHORIZED_USER, 401);
        }
      }
      
      report = await ReportService.get_qari_calendar_report(qari_id);
    } else if(institute_id) {
      if(req.auth.role != USER_ROLES.ADMIN && req.auth.role != USER_ROLES.INSTITUTE && req.auth.role_id != institute_id) {
        ReE(res, ERRORS.UNAUTHORIZED_USER, 401);
      }

      report = await ReportService.get_institute_calendar_report(institute_id);
    } else {
      if(req.auth.role != USER_ROLES.ADMIN) {
        ReE(res, ERRORS.UNAUTHORIZED_USER, 401);
      }

      report = await ReportService.get_full_calendar_report();
    }

    ReS(res, {
      report
    });
  } catch (err) {
    ReE(res, err, 422);
  }
});

router.get('/institute', authenticate, async (req, res) => {
  try {
    if(req.auth.role != USER_ROLES.ADMIN) {
      ReE(res, ERRORS.UNAUTHORIZED_USER, 401);
    } else {
      let report = await ReportService.get_institutes_reports();
      ReS(res, {
        report
      });
    }
  } catch (err) {
    ReE(res, err, 422);
  }
});

router.get('/institute/:institute_id', authenticate, async (req, res) => {
  try {
    let institute_id = req.params.institute_id;

    if(req.auth.role != USER_ROLES.ADMIN && req.auth.role != USER_ROLES.INSTITUTE && req.auth.role_id != institute_id) {
      ReE(res, ERRORS.UNAUTHORIZED_USER, 401);
    } else {
      let report = await ReportService.get_institute_report(institute_id);
      ReS(res, {
        report
      });
    }
  } catch (err) {
    ReE(res, err, 422);
  }
});

module.exports = router;