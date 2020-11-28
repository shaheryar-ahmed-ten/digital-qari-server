const { Qari } = require("../../models");

const UserRoleService = require("./user_role.service");
const S3FileUploadService = require("./s3_file_upload.service");
const { TE } = require("../../utils/helpers");
const { SLOT_STATUS } = require("../../utils/constants");

class QariService extends UserRoleService {
    constructor() {
        super(Qari);
    }

    async create(obj, options) {
        try {
            if(obj["recitation"]) obj.recitation = await S3FileUploadService.upload_file(`${obj.user}-recitation`, obj.recitation.file);
            return super.create(obj, options);
        } catch (err) {
            TE(err);
        }
    }

    async update(id, fields) {
        try {
          let qari = await Qari.findById(id);
          let recitation = fields.recitation;
          if(recitation) {
              fields.recitation = await S3FileUploadService.upload_file(`${qari.user._id}-recitation`, recitation.file);
          }
          return super.update(id, fields);
        } catch (err) {
            TE(err);
        }
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

    async assign_slot(qari_id, slot_day, slot_num, status, options) {
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
            await qari.save(options);
            return qari;
        } catch (err) {
            TE(err);
        }
    }

    async assign_bulk_slots(qari_id, slots, options) {
        try {
            let qari = await this.find_by_id(qari_id);

            let calendar = qari["calendar"].toJSON();


            for(let slot_day in slots){

                if (!calendar[slot_day]) calendar[slot_day] = {};
    
                let slot_inserted_obj = calendar[slot_day];
                for(let slot_num in slots[slot_day]){
                    if (slots[slot_day][slot_num] === SLOT_STATUS.UNASSIGNED) {
                        delete slot_inserted_obj[slot_num];
                    } else {
                        slot_inserted_obj[slot_num] = slots[slot_day][slot_num];
                    }
                }
                qari["calendar"].set(slot_day, slot_inserted_obj);
            }

            qari.markModified('calendar');
            await qari.save(options);
            return qari;
        } catch (err) {
            TE(err);
        }
    }

    async condensed_find(filters = {}, fields = "_id name calendar") {
        try {
            let documents = await this.Model.find(filters).select(fields).lean();
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