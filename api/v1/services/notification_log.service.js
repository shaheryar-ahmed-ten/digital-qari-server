const { Notification_logs, User } = require("../../models");

const UserRoleService = require("./user_role.service");
const S3FileUploadService = require("./s3_file_upload.service");
const { TE } = require("../../utils/helpers");
const { SLOT_STATUS, ERRORS, DAYS_OF_WEEK } = require("../../utils/constants");
const ObjectId = require('mongoose').Types.ObjectId;
const CrudService = require("./crud.service")
class NotificationLogService extends CrudService {
    constructor() {
        super(Notification_logs);
    }

    async find_by_student_id(student_id) {
        try {
            let document = await Notification_logs.find({ "student": student_id });
            if (!document) return TE(ERRORS.NOTIFICATION_NOT_FOUND);
            return document;
        } catch (err) {
            TE(err);
        }
    }

    async find_by_qari_id(qari_id) {
        try {
            let document = await Notification_logs.find({ "qari": qari_id });
            if (!document) return TE(ERRORS.NOTIFICATION_NOT_FOUND);
            return document;
        } catch (err) {
            TE(err);
        }
    }

}

module.exports = new NotificationLogService();