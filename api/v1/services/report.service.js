const { Admin } = require("../../models");

const { TE } = require("../../utils/helpers");
const { ERRORS, SLOT_STATUS } = require("../../utils/constants");

const QariService = require("../services/qari.service");
const InstituteService = require("../services/institute.service");

class ReportService {
  async get_qari_report(qari_id) {
    try {
      let qari = await QariService.find_by_id(qari_id);
      
      let report = {};
      if(!qari) return {};
      let days = qari.calendar.toObject();
      for(const day of days) {
        let assigned = 0, available = 0, unavailable = 0;
        Object.values(day[1]).forEach(status => {
          if(status == SLOT_STATUS.AVAILABLE) available += 1;
          if(status == SLOT_STATUS.UNAVAILABLE) unavailable += 1;
        });
        assigned = available + unavailable;
        report[day[0]] = {
          available,
          unavailable,
          assigned
        }
      }
      
      return report;
    } catch (err) {
      TE(err);
    }
  }

  async get_institute_report(institute_id) {
    try {
      let {documents: qaris} = await QariService.find_by_institute_id(institute_id);

      let report = {};
      for(let qari in qaris) {
        qari = qaris[qari];
        report[qari._id] = await this.get_qari_report(qari._id);
      }

      report = this.get_aggregate_report(report);

      return report;
    } catch (err) {
      TE(err);
    }
  }

  async get_full_report() {
    try {
      let {documents: qaris} = await QariService.get_all_ids();

      
      let report = {};
      for(let qari in qaris) {
        qari = qaris[qari];
        report[qari._id] = await this.get_qari_report(qari._id);
      }
      
      report = this.get_aggregate_report(report);
      return report;
    } catch (err) {
      TE(err);
    }
  }

  get_aggregate_report(sub_reports) {
    let report = {};
    for(let sub_report in sub_reports) {
      sub_report = sub_reports[sub_report];
      for(const day in sub_report) {
        if(!report[day]) report[day] = {};
        for(const prop in sub_report[day]) {
          if(!report[day][prop]) report[day][prop] = 0;
          report[day][prop] += sub_report[day][prop];
        }
      }
    }
    return report;
  }
}

module.exports = new ReportService();