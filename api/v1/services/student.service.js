const { Student } = require("../../models");

const UserRoleService = require("./user_role.service");

class StudentService extends UserRoleService {
    constructor() {
        super(Student);
    }
}

module.exports = new StudentService();