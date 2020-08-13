const { Institute } = require("../../models");

const { TE } = require("../../utils/helpers");

class InstituteService {
    async find_by_user_id(user_id) {
        try {
            let institute = await Institute.findOne({ user: user_id });
            return institute;
        } catch (err) {
            TE(err);
        }
    }

    async find_by_id(id) {
        try {
            let institute = await Institute.findById(id);
            return institute;
        } catch (err) {
            TE(err);
        }
    }

    async get_all(limit = 10, page = 1) {
        try {
            if (!limit) limit = 10;
            if (!page) page = 1;
            let institutes = await Institute.find().skip((page - 1) * limit).limit(limit).select('-password').populate('user');
            let total_count = await Institute.countDocuments();
            return {institutes, total_count};
        } catch (err) {
            TE(err);
        }
    }

    async update(id, fields) {
      try {
        let institute = await Institute.findById(id);
        Object.assign(institute, fields);
        await institute.save();
      } catch (err) {
        TE(err);
      }
    }
}

module.exports = new InstituteService();