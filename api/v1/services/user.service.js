const { User, Admin, Institute, Qari } = require("../../models");

const { TE } = require("../../utils/helpers");
const { ERRORS, USER_ROLES } = require("../../utils/constants");

const AdminService = require("./admin.service");
const InstituteService = require("./institute.service");
const QariService = require("./qari.service");
const S3FileUploadService = require("./s3_file_upload.service");

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
            let user_with_role, role_service;
            switch(user_obj.role) {
                case USER_ROLES.ADMIN:
                    user_with_role = new Admin(user_obj);
                    role_service = AdminService;
                    break;
                case USER_ROLES.INSTITUTE:
                    user_with_role = new Institute(user_obj);
                    role_service = InstituteService;
                    break;
                case USER_ROLES.QARI:
                    user_with_role = new Qari(user_obj);
                    role_service = QariService;
                    break;
            }
            
            if(user_obj["email"]) user_obj["email"] = user_obj["email"].toLowerCase();
            
            let user = new User(user_obj);
            
            if(user_obj.role) await user_with_role.validate();
            
            await user.save();
            
            user_with_role.user = user._id;
            let picture = user_obj.picture;
            if(picture) {
                user_with_role.picture = await S3FileUploadService.upload_file(`${user._id}-profile_picture`, picture);
            }
            
            return (await role_service.create(user_with_role));
        } catch(err) {
            TE(err);
        }
    }

    async get_role_id(user_id, role) {
        try {
            switch(role) {
                case USER_ROLES.ADMIN:
                    return (await AdminService.find_by_user_id(user_id))._id;
                case USER_ROLES.INSTITUTE:
                    return (await InstituteService.find_by_user_id(user_id))._id;
                case USER_ROLES.QARI:
                    return (await QariService.find_by_user_id(user_id))._id;
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

    async deactivate(user_id) {
        try {
            let user = await User.updateOne({
                _id: user_id
            }, {
                active: false
            });
            return true;
        } catch(err) {
            TE(err);
        }
    }

    async activate(user_id) {
        try {
            let user = await User.updateOne({
                _id: user_id
            }, {
                active: true
            });
            return true;
        } catch(err) {
            TE(err);
        }
    }

}

module.exports = new UserService();