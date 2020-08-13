const passport = require('passport');
const LocalStrategy = require("passport-local").Strategy;
const UserService = require('../v1/services/user.service');
const { ERRORS } = require('./constants');

const user_local_strategy = new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    async function(email, password, done) {
        try {
            email = email.toLowerCase();
            let user = await UserService.find_by_email(email);
            if(!user) {
                return done(null, false, {error: ERRORS.INVALID_CREDENTIALS});
            } else {
                let is_match = user.compare_password(password);
                if(!is_match) return done(null, false, {error: ERRORS.INVALID_CREDENTIALS});
                else {
                    if(user.locked) return done(null, false, {error: ERRORS.ACCOUNT_IS_LOCKED});
                    user.role_id = await UserService.get_role_id(user._id, user.role);
                    return done(null, user);
                }
            }

        } catch(err) {
            return done(err);
        }
    }
)

passport.use('user-local', user_local_strategy);