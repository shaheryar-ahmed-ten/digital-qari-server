var express = require('express');
var router = express.Router();

const {ReS, ReE, authenticate} = require("../utils/helpers");
const S3FileUploadService = require("../services/s3_file_upload.service");

router.post('/', authenticate, async(req, res) => {
  try {
    let key = req.body.key;
    let file = req.body.file;

    let location = await S3FileUploadService.upload_file(key, file);

    ReS(res, {location});
  } catch(err) {
    ReE(res, err, 422);
  }
});

module.exports = router;