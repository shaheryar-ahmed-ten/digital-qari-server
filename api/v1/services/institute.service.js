const { Institute } = require("../../models");

const UserRoleService = require("./user_role.service");
const QariService = require("./qari.service");
const { TE } = require("../../utils/helpers");

class InstituteService extends UserRoleService {
    constructor() {
        super(Institute);
    }

    async update(id, fields) {
        console.log(fields);
        try {
            if (fields.base_fee) {
                await QariService.update_all({
                    institute: id,
                    fee_touched: { $ne: true }
                }, {
                    fee: fields.base_fee
                });
            }

            return super.update(id, fields);
        } catch (err) {
            TE(err);
        }
    }
}

module.exports = new InstituteService();