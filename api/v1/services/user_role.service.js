const { User } = require("../../models");
const { ERRORS  , USER_ROLES} = require("../../utils/constants");
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

    async update(id, fields, options) {
        try {
            let document = await this.find_by_id(id);
            let {new_password, old_password} = fields;
            if(document) {
                if(new_password && old_password) {
                    let user = await User.findById(document.user);
                    if (user && !user.compare_password(old_password)) TE(ERRORS.PASSWORDS_DONT_MATCH);
                    else {
                        user.password = new_password;
                        await user.save();
                        return true;
                    }
                    delete fields.old_password;
                    delete fields.new_password;
                }
                return super.update(id, fields, options);
            } else {
                TE(ERRORS.USER_NOT_FOUND);
            }
        } catch(err) {
            TE(err);
        }
    }

   // update the Qari information from admin/user 
    async updateQari(id, fields, role) {
        try {
            let document = await this.find_by_id(id);
            let {new_password, old_password} = fields;
            if(document) {
                if(new_password && old_password  ) {
                    let user = await User.findById(document.user);
                    if (user && !user.compare_password(old_password)) TE(ERRORS.PASSWORDS_DONT_MATCH);
                    else {
                        user.password = new_password;
                        await user.save();
                        return true;
                    }
                    delete fields.old_password;
                    delete fields.new_password;
                }
                else if(new_password && role === USER_ROLES.ADMIN){
                    let user = await User.findById(document.user);
                        user.password = new_password;
                        await user.save();
                        return true;
                }
                return super.update(id, fields);
            } else {
                TE(ERRORS.USER_NOT_FOUND);
            }
        } catch(err) {
            TE(err);
        }
    }
}

module.exports = UserRoleService;