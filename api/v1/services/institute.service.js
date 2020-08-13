const { Institute } = require("../../models");

const UserRoleService = require("./user_role.service");

class InstituteService extends UserRoleService {
    constructor() {
        super(Institute);
    }
}

module.exports = new InstituteService();