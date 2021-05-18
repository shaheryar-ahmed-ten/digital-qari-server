const { Notification_logs } = require("../../models");

const UserRoleService = require("./user_role.service");
const S3FileUploadService = require("./s3_file_upload.service");
const { TE } = require("../../utils/helpers");
const { SLOT_STATUS, ERRORS, DAYS_OF_WEEK } = require("../../utils/constants");

class NotificationLogService extends UserRoleService {
    constructor() {
        super(Notification_logs);
    }

    async find_by_student_id(student_id) {
        try {
            let document = await this.Model.findById(student_id);
            if (!document) return TE(ERRORS.NOTIFICATION_NOT_FOUND);
            return document;
        } catch (err) {
            TE(err);
        }
    }

    async find_by_qari_id(qari_id) {
        try {
            let document = await this.Model.findById(qari_id);
            if (!document) return TE(ERRORS.NOTIFICATION_NOT_FOUND);
            return document;
        } catch (err) {
            TE(err);
        }
    }

}

module.exports = new NotificationLogService();