const { Admin } = require("../../models");

const { TE } = require("../../utils/helpers");
const { ERRORS } = require("../../utils/constants");

class AdminService {
    async find_by_user_id(user_id) {
        try {
            let admin = await Admin.findOne({ user: user_id });
            return admin;
        } catch(err) {
            TE(err);
        }
    }

    async find_by_id(id) {
        try {
            let admin = await Admin.findById(id);
            return admin;
        } catch(err) {
            TE(err);
        }
    }

    async get_all(limit=10, page=1) {
        try {
            if(!limit) limit = 10;
            if(!page) page = 1;
            let admins = await Admin.find().skip((page-1)*limit).limit(limit).select('-password');
            return admins;
        } catch(err) {
            TE(err);
        }
    }
}

module.exports = new AdminService();