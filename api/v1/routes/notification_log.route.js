var express = require('express');
var router = express.Router();

const { ReS, ReE, authenticate, TE } = require("../../utils/helpers");
const { ERRORS, USER_ROLES } = require("../../utils/constants");

const NotificationLogService = require("../services/notification_log.service");

router.get('/all', authenticate, async (req, res) => {
    try {
        switch (req.auth.role) {
            case 'student':
                await NotificationLogService.find_by_student_id(req.auth.id)
            case 'qari':
                await NotificationLogService.find_by_qari_id(req.auth.id)

        }
        let { documents: notification_logs } = await NotificationLogService.find_by_id({ "student": req.auth.id });
        ReS(res, {
            notification_logs
        });
    } catch (err) {
        ReE(res, err);
    }
});

module.exports = router;