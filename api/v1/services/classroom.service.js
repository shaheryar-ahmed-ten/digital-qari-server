const { Classroom } = require("../../models");

const { TE } = require("../../utils/helpers");
const { ERRORS } = require("../../utils/constants");

const {v4: uuidV4} = require('uuid');
const CrudService = require("./crud.service");

class ClassroomService extends CrudService {
  constructor() {
    super(Classroom);
  }

  async create(obj) {
    try {
      obj.room_id = uuidV4();
      return super.create(obj);
    } catch(err) {
      console.log(err);
      TE(err);
    }
  }
}

module.exports = new ClassroomService();