const { Session } = require("../../models");
const { ERRORS } = require("../../utils/constants");

const { TE } = require("../../utils/helpers");
const ChimeMeetingService = require("../services/chime_meeting.service");

const CrudService = require("../services/crud.service");

class SessionService extends CrudService {
  constructor() {
    super(Session);
  }

  async start(obj) {
    try {
      let {session_id, user_id} = obj;

      let session = await this.find_by_id(session_id);
      if(session.qari != user_id && session.student != user_id) TE(ERRORS.UNAUTHORIZED_USER);

      else {
        let meeting = await ChimeMeetingService.create_meeting(session_id);
        let attendee = await ChimeMeetingService.create_attendee(meeting.Meeting.MeetingId, user_id);

        return {
          ...meeting,
          ...attendee
        };
      }

    } catch (err) {
      TE(err);
    }
  }
}

module.exports = new SessionService();