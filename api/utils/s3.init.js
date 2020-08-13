const {TE} = require("./helpers");
const process = require("process");
const AWS = require('aws-sdk');

AWS.config.loadFromPath(process.cwd()+'/api/v1/utils/aws_config.json');

const s3 = new AWS.S3({
    apiVersion: '2006-03-01'
});

class S3Object {
    constructor(key, body, type) {
        this.key = key;
        this.body = body;
        this.type = type;
    }

    get upload_params() {
        return {
            Bucket: "datadarbar",
            Key: this.key,
            Body: this.body,
            ContentEncoding: 'base64',
            ContentType: this.type
        };
    }
}

async function upload_to_s3(s3_image) { // s3_image: S3Object
    try {
        const data = await s3.upload({
            ACL: 'public-read',
            ...s3_image.upload_params
        }).promise();
        
        return data;
    } catch(err) {
        TE(err);
    }

}

module.exports = {
    S3Object,
    upload_to_s3
};