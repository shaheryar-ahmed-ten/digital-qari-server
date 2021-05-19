var express = require('express');
var router = express.Router();

const { ReS, ReE, authenticate, TE } = require("../../utils/helpers");
const { ERRORS, USER_ROLES } = require("../../utils/constants");

const NotificationLogService = require("../services/notification_log.service");

router.get('/all', authenticate, async (req, res) => {
    try {
        let notification_logs = '';
        switch (req.auth.role) {
            case 'student':
                notification_logs = await NotificationLogService.find_by_student_id(req.auth.id)
                break;
            case 'qari':
                notification_logs = await NotificationLogService.find_by_qari_id(req.auth.id)
                break;
        }
        ReS(res, {
            notification_logs
        });
    } catch (err) {
        console.log("err", err);
        ReE(res, err);
    }
});

module.exports = router;