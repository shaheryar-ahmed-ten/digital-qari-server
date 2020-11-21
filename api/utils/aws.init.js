const process = require("process");
const AWS = require('aws-sdk');

AWS.config.loadFromPath(process.cwd()+'/api/utils/aws_config.json');

module.exports = {
    AWS
};