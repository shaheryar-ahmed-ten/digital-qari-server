const { Booking, Session } = require("../../models");
const { PAYMENT_PLANS, ERRORS, SLOT_STATUS, DAYS_OF_WEEK } = require("../../utils/constants");

const CrudService = require("./crud.service");
const QariService = require("./qari.service");
const StudentService = require("./student.service");

class BookingService extends CrudService {
    constructor() {
        super(Booking);
    }

    async create(obj, options) {
      let transactionSession;
      try {
        let {qari_id, student_id, payment_plan, qari_slots, amount, is_admin} = obj;
        transactionSession = await Booking.startSession();
        await transactionSession.startTransaction();

        let booking = new Booking({
          qari: qari_id,
          student: student_id,
          amount
        });

        let student = await StudentService.find_by_id(student_id);

        if(!(payment_plan in PAYMENT_PLANS)) TE(ERRORS.INVALID_PAYMENT_PLAN);

        student.payment_plan = payment_plan;

        let months = PAYMENT_PLANS[payment_plan].payment_frequency;

        let due_date = new Date();
        due_date.setMonth(due_date.getMonth()+months);
        due_date.setHours(23, 59, 59);
        student.payment_due_date = due_date;
        
        await student.save({session: transactionSession})
        const calendarToUpdate = {};
        for(let day in qari_slots) {
          for(let slot in qari_slots[day]) {
            let date = new Date();
            date.setDate(date.getDate() + (DAYS_OF_WEEK[day] + 7 - date.getDay()) % 7);
            slot = qari_slots[day][slot];

            let tmp = new Date(date.getTime());
            tmp.setDate(tmp.getDate()+7);

            while(tmp < due_date) {
              let session = new Session();
              session.qari = qari_id;
              session.student = student_id;

              date.setDate(date.getDate()+7);
              date.setHours(0, slot*30, 0, 0);
              
              session.start_time = date;

              tmp.setDate(tmp.getDate()+7);

              await session.save({session: transactionSession});
            }
            if(!calendarToUpdate[day])calendarToUpdate[day]={}
            calendarToUpdate[day][slot] = SLOT_STATUS.UNAVAILABLE;
          }
        }
        await QariService.assign_bulk_slots(qari_id, calendarToUpdate, {session: transactionSession});

        if(is_admin) booking.amount = amount;
        else {
          let qari = await QariService.find_by_id(qari_id);
          booking.amount = qari.fee;
        }

        await booking.save({session: transactionSession});

        await transactionSession.commitTransaction();
        return {booking};
      } catch (err) {
        await transactionSession.abortTransaction();
        TE(err);
      } finally {
        transactionSession.endSession();
      }
    }
}

module.exports = new BookingService();