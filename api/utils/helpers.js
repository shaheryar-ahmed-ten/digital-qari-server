const jwt = require('jsonwebtoken');
const express_jwt = require('express-jwt');

const mongoose = require("mongoose");

module.exports.convert_to_object_id = function (id) {
    return mongoose.Types.ObjectId(id);
}

module.exports.get_file_buffer = (b64_string) => {
    return new Buffer(b64_string.replace(/^data:(.*,)?/, ""), 'base64');
}

module.exports.ReE = function (res, err, code = 422) { // Error Web Response
    if (typeof err == 'object' && typeof err.message != 'undefined') {
        err = err.message;
    }

    if (typeof code !== 'undefined') res.statusCode = code;

    return res.json({ success: false, error: err });
};

module.exports.ReS = function (res, data, code) { // Success Web Response
    let send_data = { success: true };

    if (typeof data == 'object') {
        send_data = Object.assign(data, send_data);//merge the objects
    }

    if (typeof code !== 'undefined') res.statusCode = code;

    return res.json(send_data)
};

module.exports.TE = TE = function (err_message, log = true) { // TE stands for Throw Error
    if (log === true) {
        console.error(err_message);
    }

    throw new Error(err_message);
};

module.exports.create_token = auth => {
    return jwt.sign(
        {
            id: auth.id,
            role: auth.role,
            role_id: auth.role_id
        },
        'digitalqariwalaproject'
    );
};

module.exports.generate_token = (req, res, next) => {
    req.token = this.create_token(req.auth);
    next();
};

module.exports.send_token = (req, res) => {
    res.setHeader('x-auth-token', req.token);
    this.ReS(res, req.auth);
};

module.exports.authenticate = express_jwt({
    secret: 'digitalqariwalaproject',
    requestProperty: 'auth',
    getToken: function (req) {
        if (req.headers['x-auth-token']) {
            return req.headers['x-auth-token'];
        }
        return null;
    },

});

module.exports.map_to_object = (map) => {
    const out = Object.create(null)
    map.forEach((value, key) => {
        if (value instanceof Map) {
            out[key] = map_to_object(value)
        }
        else {
            out[key] = value
        }
    })
    return out
};