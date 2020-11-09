const { TE, get_file_buffer } = require("../../utils/helpers");
const { S3Object, upload_to_s3 } = require("../../utils/s3.init");

class S3FileUploadService {
  async upload_file(key, file) {
    try {
      const buff = get_file_buffer(file["value"]);
      const data = await upload_to_s3(new S3Object(key, buff, file["type"]));
      
      return data["Location"];
    } catch(err) {
      TE(err);
    }
  }
}

module.exports = new S3FileUploadService();