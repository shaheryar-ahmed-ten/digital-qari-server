const { TE, map_to_object } = require("../../utils/helpers");
const { SLOT_STATUS } = require("../../utils/constants");

const QariService = require("../services/qari.service");
const InstituteService = require("../services/institute.service");

class ReportService {
  async get_qari_calendar_report(qari_id) {
    try {
      let qari = await QariService.find_by_id(qari_id);
      if (!qari) return {};
      let qariCalendar = map_to_object(qari.calendar.toObject());
      return this.merge_qari_calendars([qariCalendar]);
    } catch (err) {
      TE(err);
    }
  }

  async get_institute_calendar_report(institute_id) {
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

  async get_full_calendar_report() {
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

  async get_institute_report(institute_id) {
    try {
      let report = {};
      report.total_qaris = await QariService.count({
        institute: institute_id
      });
      report.total_students = 0;
      report.students_per_qari = [];
      report.revenue_per_qari = [];
      report.total_revenue = 0;

      return report;
    } catch (err) {
      TE(err);
    }
  }

  async get_institutes_reports() {
    try {
      let reports = {};
      let {documents: institutes} = await InstituteService.find();
      for await (let institute of institutes) {
        let sub_report = {};
        sub_report.total_qaris = await QariService.count({
          institute: institute["_id"]
        });
        sub_report.total_students = 0;
        sub_report.students_per_qari = [];
        sub_report.revenue_per_qari = [];
        sub_report.total_revenue = 0;

        reports[institute["_id"]] = sub_report;
      }

      let report = {
        total_qaris: 0,
        total_students: 0,
        total_revenue: 0,
        students_per_qari: 0,
        revenue_per_qari: 0
      };

      Object.keys(reports).forEach(institute => {
        let sub_report = reports[institute];
        report.total_qaris += sub_report.total_qaris;
        report.total_students += sub_report.total_students;
        report.total_revenue += sub_report.total_revenue;
        report.students_per_qari += sub_report.students_per_qari;
        report.revenue_per_qari += sub_report.revenue_per_qari;
      });
      
      return report;
    } catch (err) {
      TE(err);
    }
  }
}

module.exports = new ReportService();