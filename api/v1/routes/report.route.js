var express = require('express');
var router = express.Router();

const { ReS, ReE, authenticate, TE } = require("../../utils/helpers");
const { ERRORS, USER_ROLES } = require("../../utils/constants");

const ReportService = require("../services/report.service");
const QariService = require("../services/qari.service");

router.get('/calendar', authenticate, async (req, res) => {
  try {
    let institute_id = req.query.institute;
    let qari_id = req.query.qari;

    let report;

    if (qari_id) {
      if (req.auth.role != USER_ROLES.ADMIN && req.auth.role != USER_ROLES.INSTITUTE && req.auth.role_id != qari_id) {
        TE(ERRORS.UNAUTHORIZED_USER);
      }

      if (req.auth.role == USER_ROLES.INSTITUTE) {
        let qari = await QariService.find_by_id(qari_id, 0);
        if (!qari || qari.institute._id != req.auth.role_id) {
          TE(ERRORS.UNAUTHORIZED_USER);
        }
      }

      report = await ReportService.get_qari_calendar_report(qari_id, 0);
    } else if (institute_id) {
      if (req.auth.role != USER_ROLES.ADMIN && req.auth.role != USER_ROLES.INSTITUTE && req.auth.role_id != institute_id) {
        TE(ERRORS.UNAUTHORIZED_USER);
      }

      report = await ReportService.get_institute_calendar_report(institute_id);
    } else {
      if (req.auth.role != USER_ROLES.ADMIN) {
        TE(ERRORS.UNAUTHORIZED_USER);
      }

      report = await ReportService.get_full_calendar_report(0);
    }

    ReS(res, {
      report
    });
  } catch (err) {
    ReE(res, err);
  }
});

router.get('/institute', authenticate, async (req, res) => {
  try {
    if (req.auth.role != USER_ROLES.ADMIN) {
      TE(ERRORS.UNAUTHORIZED_USER);
    } else {
      let report = await ReportService.get_institute_report();
      ReS(res, {
        report
      });
    }
  } catch (err) {
    ReE(res, err);
  }
});

router.get('/institute/:institute_id', authenticate, async (req, res) => {
  try {
    let institute_id = req.params.institute_id;

    if (req.auth.role != USER_ROLES.ADMIN && req.auth.role != USER_ROLES.INSTITUTE && req.auth.role_id != institute_id) {
      TE(ERRORS.UNAUTHORIZED_USER);
    } else {
      let report = await ReportService.get_institute_report(institute_id);
      ReS(res, {
        report
      });
    }
  } catch (err) {
    ReE(res, err);
  }
});

module.exports = router;