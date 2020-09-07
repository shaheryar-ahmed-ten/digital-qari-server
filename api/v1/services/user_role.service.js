const { TE } = require("../../utils/helpers");

const CrudService = require("./crud.service");

class UserRoleService extends CrudService {
    constructor(model) {
        super(model);
        this.Model = model;
    }

    async find_by_user_id(user_id) {
        try {
            let document = await this.Model.findOne({ user: user_id });
            return document;
        } catch (err) {
            TE(err);
        }
    }
}

module.exports = UserRoleService;