const { Qari } = require("../../models");

const UserRoleService = require("./user_role.service");

class QariService extends UserRoleService {
    constructor() {
        super(Qari);
    }
}

module.exports = new QariService();