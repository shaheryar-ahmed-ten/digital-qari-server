const { User, Admin, Restaurant, Rider } = require("../../models");

const { TE } = require("../../utils/helpers");
const { ERRORS, USER_ROLES } = require("../../utils/constants");

const AdminService = require("./admin.service");
const RestaurantService = require("./restaurant.service");
const RiderService = require("./rider.service");

class UserService {
    async find_by_email(email) {
        try {
            let user = await User.findOne({ email });
            return user;
        } catch(err) {
            TE(err);
        }
    }

    async find_by_id(id) {
        try {
            let user = await User.findById(id);
            return user;
        } catch(err) {
            TE(err);
        }
    }

    async create(user_obj, is_first_signup=false) {
        try {
            let user_with_role;
            switch(user_obj.role) {
                case USER_ROLES.ADMIN:
                    user_with_role = new Admin(user_obj);
                    break;
            }
            
            if(user_obj["email"]) user_obj["email"] = user_obj["email"].toLowerCase();
            let user = new User(user_obj);
            await user_with_role.validate();
            await user.save();
            user_with_role.user = user._id;
            await user_with_role.save();
            
            return user_with_role;
        } catch(err) {
            TE(err);
        }
    }

    async get_role_id(user_id, role) {
        try {
            switch(role) {
                case USER_ROLES.ADMIN:
                    return (await AdminService.find_by_user_id(user_id))._id;
            }
        } catch(err) {
            TE(err);
        }
    }

    async get_all(limit=10, page=1) {
        try {
            if(!limit) limit = 10;
            if(!page) page = 1;
            let users = await User.find().skip((page-1)*limit).limit(limit).select('-password');
            return users;
        } catch(err) {
            TE(err);
        }
    }

    async update_user_token(email, token) {
        try {
            let user = await User.findOne({email});
            if(!user) TE(ERRORS.USER_NOT_FOUND);
            else {
                user.token = token;
                await user.save();
                return true;
            }
        } catch(err) {
            TE(err);
        }
    }

    async change_password(new_password, token, user_id, old_password) {
        try {
            if(user_id) {
                let user = await User.findById(user_id);
                if(user && !user.compare_password(old_password)) TE(ERRORS.PASSWORDS_DONT_MATCH);
                else {
                    user.password = new_password;
                    await user.save();
                    return true;
                }
            } else {
                let user = await User.findOne({token});
                if(!user) TE(ERRORS.USER_NOT_FOUND);
                else {
                    const oneday = 60 * 60 * 24 * 1000;
                    if((+new Date()) - (+user.updated_at) > oneday) TE(ERRORS.TOKEN_EXPIRED);
                    else if(user.token != token) TE(ERRORS.UNAUTHORIZED_USER);
                    else {
                        user.password = new_password;
                        user.token = "";
                        await user.save();
                        return true;
                    }
                }
            }
        } catch(err) {
            TE(err);
        }
    }

    async lock(user_id) {
        try {
            let user = await User.updateOne({
                _id: user_id
            }, {
                locked: true
            });
            return true;
        } catch(err) {
            TE(err);
        }
    }

    async unlock(user_id) {
        try {
            let user = await User.updateOne({
                _id: user_id
            }, {
                locked: false
            });
            return true;
        } catch(err) {
            TE(err);
        }
    }

}

module.exports = new UserService();