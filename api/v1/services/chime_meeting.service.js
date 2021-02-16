const { Chime } = require("../../utils/chime.init");
const { TE } = require("../../utils/helpers");

class ChimeMeetingService {
  async create_meeting(session_id, host_id) {
    try {
      let meeting = await Chime.createMeeting({
          ClientRequestToken: session_id,
          MeetingHostId: host_id
      }).promise();

      return {
        ...meeting
      };

    } catch (err) {
      TE(err);
    }
  }

  async create_attendee(meeting_id, attendee_id) {
    try {
      let attendee = (await Chime.createAttendee({
        MeetingId: meeting_id,
        ExternalUserId: attendee_id
      }).promise());

      return {
        ...attendee
      };

    } catch (err) {
      TE(err);
    }
  }

  async end_meeting(meeting_id) {
    try {
      (await Chime.deleteMeeting({
        MeetingId: meeting_id
      }).promise());
    } catch(err) {
      TE(err);
    }
  }
}

module.exports = new ChimeMeetingService();