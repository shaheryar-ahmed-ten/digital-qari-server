const { Booking } = require("../../models");
const { PAYMENT_PLANS, ERRORS, SLOT_STATUS, DAYS_OF_WEEK } = require("../../utils/constants");
const { TE } = require("../../utils/helpers");
const db = require("../../utils/db");

const CrudService = require("./crud.service");
const StudentService = require("./student.service");
const SessionService = require("./session.service");
const QariService = require("./qari.service");

class BookingService extends CrudService {
    constructor() {
        super(Booking);
    }

    async create_booking(obj) {
      let transactionSession;

      async function update_student(student_id, payment_plan, payment_due_date) {
        try {
          let student = await StudentService.find_by_id(student_id);

          if(!(payment_plan in PAYMENT_PLANS)) TE(ERRORS.INVALID_PAYMENT_PLAN);
  
          student.payment_plan = payment_plan;
          student.payment_due_date = payment_due_date;
          
          await student.save({session: transactionSession})
        } catch(err) {
          TE(err);
        }
      }

      async function create_session(qari_id, student_id, date, slot) {
        try {
          date.setDate(date.getDate()+7);
          date.setHours(0, slot*30, 0, 0);
          
          await SessionService.create({
            qari: qari_id,
            student: student_id,
            start_time: date
          }, {session: transactionSession});
        } catch(err) {
          TE(err);
        }
      }

      async function update_qari_slots_and_create_sessions(qari_id, student_id, qari_slots, payment_due_date) {
        try {
          let qari_calendar = {};
          for(let day in qari_slots) {
            for(let slot in qari_slots[day]) {
              let date = new Date();
              date.setDate(date.getDate() + (DAYS_OF_WEEK[day] + 7 - date.getDay()) % 7);
              slot = qari_slots[day][slot];
  
              let tmp = new Date(date.getTime());
              tmp.setDate(tmp.getDate()+7);
  
              while(tmp < payment_due_date) {
                await create_session(qari_id, student_id, date, slot);
                tmp.setDate(tmp.getDate()+7);
              }

              if(!qari_calendar[day]) qari_calendar[day]={};
              qari_calendar[day][slot] = SLOT_STATUS.UNAVAILABLE;
            }
          }

          await QariService.assign_slots(qari_id, qari_calendar, {session: transactionSession});
        } catch(err) {
          TE(err);
        }
      }

      try {
        let {qari_id, student_id, payment_plan, qari_slots, amount, is_admin} = obj;

        transactionSession = await this.Model.startSession();

        await transactionSession.startTransaction();

        let months = PAYMENT_PLANS[payment_plan].payment_frequency;
  
        let payment_due_date = new Date();
        payment_due_date.setMonth(payment_due_date.getMonth()+months);
        payment_due_date.setHours(23, 59, 59);

        await update_student(student_id, payment_plan, payment_due_date);

        await update_qari_slots_and_create_sessions(qari_id, student_id, qari_slots, payment_due_date);
        
        let booking = new Booking({
          qari: qari_id,
          student: student_id,
          amount
        });

        if(is_admin) {
          booking.amount = amount;
        } else {
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
        await transactionSession.endSession();
      }
    }

    async create_free_trial_session(obj) {
      let transactionSession;
      try {
        let {qari_id, student_id, qari_slot} = obj;
        
        let {day, slot} = qari_slot;

        let date = new Date();
        date.setDate(date.getDate() + (DAYS_OF_WEEK[day] + 7 - date.getDay()) % 7);

        date.setHours(0, slot*30, 0, 0);

        transactionSession = await db.startSession();
        
        await transactionSession.startTransaction();

        let student = await StudentService.find_by_id(student_id);

        let time_difference = Math.abs(date - student.createdAt);
        let days_difference = Math.ceil(time_difference / (1000 * 60 * 60 * 24));

        if(student.free_trials < 1) {
          
          await transactionSession.abortTransaction();
          TE(ERRORS.FREE_TRIALS_FINISHED);

        } else if(days_difference > 14) {
          
          await transactionSession.abortTransaction();
          TE(ERRORS.FREE_TRIALS_DEADLINE_ENDED);

        } else {

          student.free_trials -= 1;

          let slots = {};
          slots[day] = {};
          slots[day][slot] = SLOT_STATUS.UNAVAILABLE;

          await QariService.assign_slots(qari_id, slots, {session: transactionSession});
          await student.save({session: transactionSession});

          let session = await SessionService.create({
            qari: qari_id,
            student: student_id,
            start_time: date,
            free_trial: true
          }, {session: transactionSession});

          await transactionSession.commitTransaction();

          return {session};
        }
      } catch(err) {
        TE(err);
      } finally {
        await transactionSession.endSession();
      }
    }

    async create(obj, options) {

      try {
        let {is_free_trial} = obj;
        if(is_free_trial) {
          let {session} = await this.create_free_trial_session(obj);
          return {session};
        } else {
          let {booking} = await this.create_booking(obj);
          return {booking};
        }
      } catch (err) {
        TE(err);
      }
    }
}

module.exports = new BookingService();