const { Booking, Notification_logs } = require("../../models");
const { ERRORS, SLOT_STATUS, DAYS_OF_WEEK, PAYMENT_TYPE, PAYMENT_STATUS, NOTIFICATION } = require("../../utils/constants");
const { TE } = require("../../utils/helpers");

const CrudService = require("./crud.service");
const StudentService = require("./student.service");
const UserService = require("./user.service");
const SessionService = require("./session.service");
const QariService = require("./qari.service");
const PaymentPlanService = require("./payment_plan.service");
const PaymentTransactionService = require("./payment_transaction.service");
const { send_notification } = require("./push_notification.service")

class BookingService extends CrudService {
  constructor() {
    super(Booking);
  }

  async create_booking(obj) {
    let transactionSession;

    async function update_qari_slots_and_create_sessions(qari_id, student_id, qari_slots, payment_due_date, tz_offset) {

      async function create_session(qari_id, student_id, date, day, slot) {
        try {
          date.setDate(date.getDate() + 7);
          date.setHours(0, (slot - 1) * 30, 0, 0);

          await SessionService.create({
            qari: qari_id,
            qari_slot: {
              day,
              slot
            },
            student: student_id,
            start_time: date
          }, { session: transactionSession });
        } catch (err) {
          TE(err);
        }
      }

      try {
        let qari_calendar = {};
        console.log(qari_slots);
        for (let day in qari_slots) {
          for (let slot in qari_slots[day]) {
            let date = new Date();
            date.setDate(date.getDate() + (DAYS_OF_WEEK[day] + 7 - date.getDay()) % 7);
            slot = qari_slots[day][slot];

            let tmp = new Date(date.getTime());
            tmp.setDate(tmp.getDate() + 7);

            while (tmp < payment_due_date) {
              await create_session(qari_id, student_id, date, day, slot);
              tmp.setDate(tmp.getDate() + 7);
            }

            if (!qari_calendar[day]) qari_calendar[day] = {};
            qari_calendar[day][slot] = SLOT_STATUS.UNAVAILABLE;
          }
        }

        await QariService.assign_slots(qari_id, qari_calendar, tz_offset, { session: transactionSession });
      } catch (err) {
        TE(err);
      }
    }

    async function create_payment_transactions(booking_id, amounts, student) {
        try {
          
          await PaymentTransactionService.create({
            booking: booking_id,
            amount: amounts.qari,
            type: PAYMENT_TYPE.QARI_PAYMENT
          }, {session: transactionSession});
          
          await PaymentTransactionService.create({
            booking: booking_id,
            amount: amounts.student,
            type: PAYMENT_TYPE.STUDENT_PAYMENT,
            student
          }, {session: transactionSession});

        } catch(err) {
          TE(err);
        }
      }

    try {
      let { qari_id, student_id, payment_plan, qari_slots, qari_amount, student_amount, is_admin, tz_offset, user_id, card_token } = obj;

      transactionSession = await this.Model.startSession();

      await transactionSession.startTransaction();

      payment_plan = await PaymentPlanService.find_by_id(payment_plan);
      if (!payment_plan) TE(ERRORS.INVALID_PAYMENT_PLAN);

      let months = payment_plan.frequency;

      let payment_due_date = new Date();
      payment_due_date.setMonth(payment_due_date.getMonth() + months);
      payment_due_date.setHours(23, 59, 59);

      await update_qari_slots_and_create_sessions(qari_id, student_id, qari_slots, payment_due_date, tz_offset);

      let booking = new Booking({
        qari: qari_id,
        student: student_id,
        qari_amount,
        student_amount,
        payment_plan,
        payment_due_date,
        payment_status: PAYMENT_STATUS.PAID
      });

      let amounts = {};

      if (is_admin) {
        booking.student_amount = student_amount;
        booking.qari_amount = qari_amount;

        amounts = {
          qari: qari_amount,
          student: student_amount
        };
      } else {
        let qari = await QariService.find_by_id(qari_id);
        booking.student_amount = qari.fee;
        booking.qari_amount = qari.fee;

        amounts = {
          qari: qari.fee,
          student: qari.fee
        };
      }

      await booking.save({ session: transactionSession });

      let student = await StudentService.find_by_id(student_id);

      student.card_token = card_token;

      await student.save({session: transactionSession});

      await create_payment_transactions(booking._id, amounts, student);

      let user = await UserService.find_by_id(user_id);
      const fcm_token = user.fcm_token
      const notification = await send_notification(fcm_token, NOTIFICATION.SESSION_BOOKED.title, NOTIFICATION.SESSION_BOOKED.body)
      const notification_logs = new Notification_logs({
        student: student_id,
        qari: qari_id,
        title: NOTIFICATION.SESSION_BOOKED.title,
        body: NOTIFICATION.SESSION_BOOKED.body
      })

      await notification_logs.save({ session: transactionSession })

      await transactionSession.commitTransaction();
      return { booking };
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
      transactionSession = await this.Model.startSession();

      let { qari_id, student_id, qari_slot, tz_offset } = obj;

      let { documents: sessions } = await SessionService.find({
        qari: qari_id,
        student: student_id,
        free_trial: true
      });

      if (sessions.length > 0) TE(ERRORS.QARI_ALREADY_BOOKED_ONCE);

      let { day, slot, date } = qari_slot;

      date = new Date(date);

      date.setHours(0, (slot - 1) * 30, 0, 0);

      await transactionSession.startTransaction();

      let student = await StudentService.find_by_id(student_id);

      let time_difference = Math.abs(date - student.createdAt);
      let days_difference = Math.ceil(time_difference / (1000 * 60 * 60 * 24));

      if (student.free_trials < 1) {

        await transactionSession.abortTransaction();
        TE(ERRORS.FREE_TRIALS_FINISHED);

      } else if (days_difference > 14) {

        await transactionSession.abortTransaction();
        TE(ERRORS.FREE_TRIALS_DEADLINE_ENDED);

      } else {

        student.free_trials -= 1;

        let slots = {};
        slots[day] = {};
        slots[day][slot] = SLOT_STATUS.UNAVAILABLE;

        await QariService.assign_slots(qari_id, slots, tz_offset, { session: transactionSession });
        await student.save({ session: transactionSession });

        let start_time = new Date(date);
        start_time.setMinutes(start_time.getMinutes() + tz_offset);

        let session = await SessionService.create({
          qari: qari_id,
          qari_slot: {
            day,
            slot
          },
          student: student_id,
          start_time: start_time,
          free_trial: true
        }, { session: transactionSession });

        await transactionSession.commitTransaction();

        return { session };
      }
    } catch (err) {
      TE(err);
    } finally {
      await transactionSession.endSession();
    }
  }

  async create(obj, options) {

    try {
      let { is_free_trial } = obj;
      if (is_free_trial) {
        let { session } = await this.create_free_trial_session(obj);
        return { session };
      } else {
        let { booking } = await this.create_booking(obj);
        return { booking };
      }
    } catch (err) {
      TE(err);
    }
  }
}

module.exports = new BookingService();