const { PaymentPlan } = require("../../models");

const CrudService = require("./crud.service");
const { TE } = require("../../utils/helpers");

class PaymentPlanService extends CrudService {
    constructor() {
        super(PaymentPlan);
    }
}

module.exports = new PaymentPlanService();