const { Qari } = require("../../models");

const UserRoleService = require("./user_role.service");
const { TE } = require("../../utils/helpers");

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

            return {documents, total_count};
        } catch (err) {
            TE(err);
        }
    }

    async assign_slot(qari_id, slot_day, slot_num, status) {
        try {
            let qari = await this.find_by_id(qari_id);
            
            let calendar = qari["calendar"].toJSON();
            
            if(!calendar[slot_day]) calendar[slot_day] = {};

            let slot_inserted_obj = calendar[slot_day];
            slot_inserted_obj[slot_num] = status;

            qari["calendar"].set(slot_day, slot_inserted_obj);
            qari.markModified('calendar');
            await qari.save();
            return qari;
        } catch (err) {
            TE(err);
        }
    }
}

module.exports = new QariService();