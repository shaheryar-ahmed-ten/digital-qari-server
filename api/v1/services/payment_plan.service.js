const { PaymentPlan } = require("../../models");

const CrudService = require("./crud.service");
const { TE } = require("../../utils/helpers");

class PaymentPlanService extends CrudService {
    constructor() {
        super(PaymentPlan);
    }

    async exists(payment_plan_id) {
        try {
            let payment_plan = await this.Model.find_by_id(payment_plan_id);
            if(!payment_plan) return false;
            return true;
        } catch (err) {
            TE(err);
        }
    }

    async is_valid_payment_plan(payment_plan_id) {
        try {
            let payment_plan = await this.Model.find_by_id(payment_plan_id);
            if(!payment_plan) return false;
            return true;
        } catch (err) {
            TE(err);
        }
    }
}

module.exports = new PaymentPlanService();