const { Qari, Booking } = require("../../models");

const UserRoleService = require("./user_role.service");
const S3FileUploadService = require("./s3_file_upload.service");
const { TE } = require("../../utils/helpers");
const { SLOT_STATUS, ERRORS, DAYS_OF_WEEK } = require("../../utils/constants");

class QariService extends UserRoleService {
    constructor() {
        super(Qari);
    }

    async create(obj, options) {
        try {
            if(obj["recitation"]) obj.recitation = await S3FileUploadService.upload_file(`${obj.user}-recitation`, obj.recitation);
            return super.create(obj, options);
        } catch (err) {
            TE(err);
        }
    }

    async update(id, fields) {
        try {
          let qari = await this.Model.findById(id);
          if(fields.recitation) {
              fields.recitation = await S3FileUploadService.upload_file(`${qari.user._id}-recitation`, fields.recitation);
          }
          return super.update(id, fields);
        } catch (err) {
            TE(err);
        }
    }

    async find_by_institute_id(institute_id) {
        try {
            let documents = await this.Model.find({
                institute: institute_id
            });

            let total_count = await this.Model.countDocuments({
                institute: institute_id
            });

            return { documents, total_count };
        } catch (err) {
            TE(err);
        }
    }

    get_next_day(day) {
        return Object.keys(DAYS_OF_WEEK)[(DAYS_OF_WEEK[day] + 1) % 7];
    }

    get_prev_day(day) {
        return Object.keys(DAYS_OF_WEEK)[(7 + DAYS_OF_WEEK[day] - 1) % 7];
    }

    add_tz_offset_to_calendar(calendar, tz_offset) {
        let offseted_calendar = {}
        for(let day in calendar) {
            for(let slot in calendar[day]) {
                let new_slot = ~~slot - (tz_offset/30);
                if(new_slot < 1) {
                    new_slot = 48+new_slot;
                    if(!offseted_calendar[this.get_prev_day(day)]) {
                        offseted_calendar[this.get_prev_day(day)] = {}
                    }
                    offseted_calendar[this.get_prev_day(day)][new_slot] = calendar[day][slot];
                } else if(new_slot > 48) {
                    new_slot = new_slot-48;
                    if(!offseted_calendar[this.get_next_day(day)]) {
                        offseted_calendar[this.get_next_day(day)] = {};
                    }
                    offseted_calendar[this.get_next_day(day)][new_slot] = calendar[day][slot];
                } else {
                    if (!offseted_calendar[day]) {
                        offseted_calendar[day] = {}
                    }
                    offseted_calendar[day][new_slot] = calendar[day][slot];
                }
            }
        }
        return offseted_calendar;
    }    

    async find_by_id(qari_id, tz_offset=0) {
        try {
            let document = await this.Model.findById(qari_id);
            
            document["calendar"] = this.add_tz_offset_to_calendar(document.calendar.toJSON(), tz_offset);

            return document;
        } catch (err) {
            TE(err);
        }
    }

    async get_all_calendars() {
        try {
            let documents = await this.Model.find().select("calendar").lean();
            let total_count = await this.Model.countDocuments();

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
                status = ~~status;
                if(Object.values(SLOT_STATUS).some(slot_status => slot_status === status)) {
                    slot_inserted_obj[slot_num] = ~~status;
                } else {
                    TE(ERRORS.INVALID_SLOT_STATUS);
                }
            }

            qari["calendar"].set(slot_day, slot_inserted_obj);
            qari.markModified('calendar');
            await qari.save(options);
            return qari;
        } catch (err) {
            TE(err);
        }
    }

    async assign_slots(qari_id, slots, tz_offset, options) {
        try {
            slots = this.add_tz_offset_to_calendar(slots, -tz_offset);
            
            let qari = await this.find_by_id(qari_id);
            let calendar = qari["calendar"].toJSON();

            for(let slot_day in slots){

                if (!calendar[slot_day]) calendar[slot_day] = {};
    
                let slot_inserted_obj = calendar[slot_day];
                for(let slot_num in slots[slot_day]){
                    if(calendar[slot_day][slot_num] === SLOT_STATUS.UNAVAILABLE) {
                        TE(ERRORS.SLOTS_ALREADY_BOOKED);  
                    } else if(calendar[slot_day][slot_num] === undefined || calendar[slot_day][slot_num] === SLOT_STATUS.UNASSIGNED) {
                        TE(ERRORS.SLOTS_DO_NOT_EXIST);
                    } else {
                        slot_inserted_obj[slot_num] = SLOT_STATUS.UNAVAILABLE;
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

    async condensed_find(filters = {}, fields = "_id name calendar fee") {
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

    async get_students(qari_id) {
        try {
            let bookings = await Booking.find({
                qari: qari_id
            });

            let students = [];
            bookings.forEach(booking => {
                students.push(booking.student);
            });

            return {students};
        } catch (err) {
            TE(err);
        }
    }
}

module.exports = new QariService();