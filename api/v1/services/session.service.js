const { Session } = require("../../models");

const { TE } = require("../../utils/helpers");
const ChimeMeetingService = require("../services/chime_meeting.service");

const CrudService = require("../services/crud.service");

class SessionService extends CrudService {
  constructor() {
    super(Session);
  }

  async create(obj, options) {
    try {
      let {session_id, user_id} = obj;

      let meeting = await ChimeMeetingService.create_meeting(session_id);
      let attendee = await ChimeMeetingService.create_attendee(meeting.Meeting.MeetingId, user_id);

      return {
        ...meeting,
        ...attendee
      };

    } catch (err) {
      TE(err);
    }
  }
}

module.exports = new SessionService();