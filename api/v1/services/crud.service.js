const { TE } = require("../../utils/helpers");

const S3FileUploadService = require("./s3_file_upload.service");

class CrudService {
    constructor(model) {
        this.Model = model;
    }

    async create(obj, options) {
        try {
            let document = new this.Model(obj);
            await document.save(options);
            return document;
        } catch (err) {
            TE(err);
        }
    }

    async update(id, fields, options) {
        try {
            let document = await this.Model.findById(id);
            let picture = fields.picture;
            if (picture) {
                fields.picture = await S3FileUploadService.upload_file(`${document.user._id}-profile_picture`, picture);
            }
            Object.assign(document, fields);
            await document.save(options);
            return document;
        } catch (err) {
            TE(err);
        }
    }

    async update_all(filters, fields) {
        try {
            await this.Model.updateMany(filters, {
                $set: fields
            });

            return true;
        } catch (err) {
            TE(err);
        }
    }

    async get_all(filters = {}, limit = 10, page = 1) {
        try {
            if (!limit) limit = 10;
            if (!page) page = 1;
            let documents = await this.Model.find(filters).skip((page - 1) * limit).limit(limit);
            let total_count = await this.Model.countDocuments(filters);
            return { documents, total_count };
        } catch (err) {
            TE(err);
        }
    }

    async find_by_id(id) {
        try {
            let document = await this.Model.findById(id);
            return document;
        } catch (err) {
            TE(err);
        }
    }

    async find(filters = {}) {
        try {
            let documents = await this.Model.find(filters);
            return { documents };
        } catch (err) {
            TE(err);
        }
    }

    async condensed_find(filters = {}) {
        try {
            let documents = await this.Model.find(filters).lean().select('_id name');
            documents = documents.map(doc => {
                delete doc["institute"];
                delete doc["user"];
                return doc;
            })
            return { documents };
        } catch (err) {
            TE(err);
        }
    }

    async count(filters) {
        try {
            let count = await this.Model.countDocuments(filters);
            return count;
        } catch (err) {
            TE(err);
        }
    }
}

module.exports = CrudService;