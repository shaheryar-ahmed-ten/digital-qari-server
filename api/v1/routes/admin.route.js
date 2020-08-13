var express = require('express');
var router = express.Router();

const passport = require("passport");

const {ReS, ReE, generate_token, send_token, authenticate, is_super_admin} = require("../../utils/helpers");
const {ERRORS} = require("../../utils/constants");

const AdminService = require("../services/admin.service");

module.exports = router;