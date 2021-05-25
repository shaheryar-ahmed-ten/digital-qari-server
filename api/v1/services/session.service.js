const { Session } = require("../../models");
const { ERRORS, SESSION_RECORDING_STATUS, USER_ROLES, SESSION_REVIEW_TYPE, SLOT_STATUS } = require("../../utils/constants");
const axios = require("axios");

const { TE } = require("../../utils/helpers");
const ChimeMeetingService = require("../services/chime_meeting.service");

const CrudService = require("./crud.service");
const QariService = require("./qari.service");
const StudentService = require("./student.service");

class SessionService extends CrudService {
  constructor() {
    super(Session);
  }

  async join(session_id, user_id) {
    try {
      let session = await this.find_by_id(session_id);
      if (!session) return TE(ERRORS.INVALID_SESSION);
      if (session.qari._id != user_id && session.student._id != user_id) TE(ERRORS.NOT_ALLOWED_IN_SESSION);

      else {
        let meeting = await ChimeMeetingService.create_meeting(session_id);

        session.meeting_id = meeting.Meeting.MeetingId;

        let attendee = await ChimeMeetingService.create_attendee(meeting.Meeting.MeetingId, user_id);

        if (session.recording_status === SESSION_RECORDING_STATUS.RECORDING_NOT_STARTED) {
          let recording_bot_verification_code = Buffer.from(+new Date() + session._id).toString('base64');

          let recording_api_url = `${process.env.RECORDING_API}?recordingAction=start&meetingURL=${process.env.CLASSROOM_URL}?sessionId=${session_id}&recording_bot_verification_code=${recording_bot_verification_code}&env=${process.env.ENVIRONMENT}`;
          console.log(`${process.env.CLASSROOM_URL}?sessionId=${session_id}&recording_bot_verification_code=${recording_bot_verification_code}&env=${process.env.ENVIRONMENT}`);
          let response = await axios.post(recording_api_url, null, {
            headers: {
              'X-Amz-Date': '20210216T224257Z',
              'Authorization': 'AWS4-HMAC-SHA256 Credential=AKIAU7A7ZS62732L644A/20210216/us-east-2/execute-api/aws4_request, SignedHeaders=host;x-amz-date, Signature=453a8391bfd7cb8069968d9538bfd921ace60a51bd62f5e2a91aec105fea1d92'
            }
          });
          console.log(`-------------------------response.data:${response.data}--------------------------------------`, response.data);
          if (response.data.failures) return TE(ERRORS.CHIME_INTERNAL_ERROR)
          let task_id = response.data;
          task_id = `${task_id}`.split("/");
          task_id = task_id[task_id.length - 1];

          session.recording_status = SESSION_RECORDING_STATUS.RECORDING_STARTED;
          session.recording_task_id = task_id;
          session.recording_bot_verification_code = recording_bot_verification_code;

        }
        await session.save();

        return {
          ...meeting,
          ...attendee
        };
      }

    } catch (err) {
      TE(err);
    }
  }

  async join_recording_bot_code(session_id, incoming_code) {
    try {
      let session = await this.find_by_id(session_id);
      if (!session) TE(ERRORS.INVALID_SESSION);
      if (session.recording_bot_verification_code !== incoming_code) TE(ERRORS.INVALID_BOT_VERIFICATION_CODE);

      let meeting = await ChimeMeetingService.create_meeting(session_id);
      let attendee = await ChimeMeetingService.create_attendee(meeting.Meeting.MeetingId, incoming_code);

      return {
        ...meeting,
        ...attendee
      };
    } catch (err) {
      TE(err);
    }
  }

  async leave(session_id) {
    let transaction_session;
    try {
      transaction_session = await Session.startSession();

      await transaction_session.startTransaction();

      let session = await this.find_by_id(session_id);

      if (session.recording_status !== SESSION_RECORDING_STATUS.RECORDING_STOPPED) {
        let recording_api_url = `${process.env.RECORDING_API}?recordingAction=stop&taskId=${session.recording_task_id}`;
        let response = await axios.post(recording_api_url, null, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'AWS4-HMAC-SHA256 Credential=AKIAU7A7ZS62732L644A/20210205/us-east-2/execute-api/aws4_request, SignedHeaders=host;x-amz-date, Signature=641122e8cff82fa7f3794c23da7f73ed806ab1e7048e42fdf798fc76fe9bc2c1'
          }
        });
        let task = response.data.task;
        let filename = task.createdAt + '.mp4';
        session.recording_status = SESSION_RECORDING_STATUS.RECORDING_STOPPED;
        session.recording_link = filename;
      }

      await ChimeMeetingService.end_meeting(session.meeting_id);
      session.held = true;

      await QariService.assign_slot(session.qari._id, session.qari_slot.day, session.qari_slot.slot, SLOT_STATUS.AVAILABLE, { session: transaction_session });

      await session.save({ session: transaction_session });

      await transaction_session.commitTransaction();

      return session;
    } catch (err) {
      await transaction_session.abortTransaction();
      TE(err);
    } finally {
      await transaction_session.endSession();
    }
  }

  async add_review(session_id, user_role, user_id, review) {
    let transaction_session;
    try {
      transaction_session = await this.Model.startSession();

      transaction_session.startTransaction();

      let session = await this.find_by_id(session_id);

      if (!session) TE(ERRORS.INVALID_SESSION);

      let user;

      if (user_role === USER_ROLES.STUDENT) {
        review.review_type = SESSION_REVIEW_TYPE.STUDENT_REVIEW;
        user = await QariService.find_by_id(session.qari);
      } else if (user_role === USER_ROLES.QARI) {
        review.review_type = SESSION_REVIEW_TYPE.QARI_REVIEW;
        user = await StudentService.find_by_id(session.student);
      }

      session.reviews.push(review);

      await session.save({ session: transaction_session });

      user.rating = ((user.num_reviews / (user.num_reviews + 1)) * user.rating) + (review.peer_rating / (user.num_reviews + 1));
      user.num_reviews += 1;

      await user.save({ session: transaction_session });

      await transaction_session.commitTransaction();

      return review;
    } catch (err) {
      await transaction_session.abortTransaction();
      TE(err);
    } finally {
      transaction_session.endSession();
    }
  }
}

module.exports = new SessionService();