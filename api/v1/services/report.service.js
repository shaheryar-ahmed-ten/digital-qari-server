const { TE, map_to_object } = require("../../utils/helpers");
const { SLOT_STATUS } = require("../../utils/constants");

const QariService = require("../services/qari.service");

class ReportService {
  async get_qari_report(qari_id) {
    try {
      let qari = await QariService.find_by_id(qari_id);
      if (!qari) return {};
      let qariCalendar = map_to_object(qari.calendar.toObject());
      return this.merge_qari_calendars([qariCalendar]);
    } catch (err) {
      TE(err);
    }
  }

  async get_institute_report(institute_id) {
    try {
      let { documents: qaris } = await QariService.find_by_institute_id(institute_id);

      let report = {};
      let calendars = qaris.map(qari => map_to_object(qari.calendar.toObject()));
      report = this.merge_qari_calendars(calendars);
      return report;
    } catch (err) {
      TE(err);
    }
  }

  async get_full_report() {
    try {
      let { documents: qaris } = await QariService.get_all_calendars();
      let report = {};
      let calendars = qaris.map(qari => qari.calendar);
      report = this.merge_qari_calendars(calendars);
      return report;
    } catch (err) {
      TE(err);
    }
  }

  merge_qari_calendars(qari_calendars) {
    if (!qari_calendars) return [];
    let report = {};

    qari_calendars.forEach(calendar => {
      Object.keys(calendar).forEach(day => {
        if (!report[day]) report[day] = {};
        Object.keys(calendar[day]).forEach(slot => {
          if (!report[day][slot]) {
            report[day][slot] = {
              available: 0,
              unavailable: 0,
            }
          }
          if (calendar[day][slot] === SLOT_STATUS.AVAILABLE) {
            report[day][slot]['available'] += 1;
          } else if (calendar[day][slot] === SLOT_STATUS.UNAVAILABLE) {
            report[day][slot]['unavailable'] += 1;
          }

        })
      })
    })
    return report;
  }
}

module.exports = new ReportService();