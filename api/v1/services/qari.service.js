const { Qari } = require("../../models");

const UserRoleService = require("./user_role.service");
const { TE } = require("../../utils/helpers");
const { SLOT_STATUS } = require("../../utils/constants");

class QariService extends UserRoleService {
    constructor() {
        super(Qari);
    }

    async find_by_institute_id(institute_id) {
        try {
            let documents = await Qari.find({
                institute: institute_id
            });

            let total_count = await Qari.countDocuments({
                institute: institute_id
            });

            return { documents, total_count };
        } catch (err) {
            TE(err);
        }
    }

    async get_all_calendars() {
        try {
            let documents = await Qari.find().select("calendar").lean();
            let total_count = await Qari.countDocuments();

            return { documents, total_count };
        } catch (err) {
            TE(err);
        }
    }

    async assign_slot(qari_id, slot_day, slot_num, status) {
        try {
            let qari = await this.find_by_id(qari_id);

            let calendar = qari["calendar"].toJSON();

            if (!calendar[slot_day]) calendar[slot_day] = {};

            let slot_inserted_obj = calendar[slot_day];
            if (slot_inserted_obj[slot_num] !== undefined && status === SLOT_STATUS.UNASSIGNED) {
                delete slot_inserted_obj[slot_num];
            } else {
                slot_inserted_obj[slot_num] = status;
            }

            qari["calendar"].set(slot_day, slot_inserted_obj);
            qari.markModified('calendar');
            await qari.save();
            return qari;
        } catch (err) {
            TE(err);
        }
    }

    async condensed_find(filters = {}) {
        try {
            let documents = await this.Model.find(filters).select('_id name calendar').lean();
            documents = documents.map(doc => {
                doc["institute"] = doc["institute"]["_id"];
                delete doc["user"];
                return doc;
            })
            return { documents };
        } catch (err) {
            TE(err);
        }
    }
}

module.exports = new QariService();