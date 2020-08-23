const { Qari } = require("../../models");

const UserRoleService = require("./user_role.service");
const { TE } = require("../../utils/helpers");

class QariService extends UserRoleService {
    constructor() {
        super(Qari);
    }

    async assign_slot(qari_id, slot_day, slot_num, status) {
        try {
            let qari = await this.find_by_id(qari_id);
            
            if(!qari["calendar"][slot_day]) qari["calendar"][slot_day] = {};
            let slot_inserted_obj = qari["calendar"][slot_day];
            slot_inserted_obj[slot_num] = status;
            qari["calendar"].set(slot_day, slot_inserted_obj);
            
            await qari.save();
            return qari;
        } catch (err) {
            TE(err);
        }
    }
}

module.exports = new QariService();