const { TE } = require("../../utils/helpers");

class UserRoleService {
    constructor(model) {
      this.Model = model;
    }

    async find_by_user_id(user_id) {
        try {
            let model = await this.Model.findOne({ user: user_id });
            return model;
        } catch (err) {
            TE(err);
        }
    }

    async find_by_id(id) {
        try {
            let model = await this.Model.findById(id);
            return model;
        } catch (err) {
            TE(err);
        }
    }

    async get_all(filters = {}, limit = 10, page = 1) {
        try {
            if (!limit) limit = 10;
            if (!page) page = 1;
            let documents = await this.Model.find(filters).skip((page - 1) * limit).limit(limit).select('-password').populate('user');
            let total_count = await this.Model.countDocuments(filters);
            return {documents, total_count};
        } catch (err) {
            TE(err);
        }
    }

    async update(id, fields) {
      try {
        let document = await this.Model.findById(id);
        Object.assign(document, fields);
        await document.save();
      } catch (err) {
        TE(err);
      }
    }
}

module.exports = UserRoleService;