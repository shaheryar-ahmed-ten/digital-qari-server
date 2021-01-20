var express = require('express');
var router = express.Router();

const {ReS, ReE, authenticate, TE} = require("../../utils/helpers");
const {ERRORS, USER_ROLES} = require("../../utils/constants");

const PaymentPlanService = require("../services/payment_plan.service");

router.get('/', async (req, res) => {
  try {
    let {documents: payment_plans} = await PaymentPlanService.find();

    ReS(res, {
      payment_plans,
    });
  } catch(err) {
    ReE(res, err);
  }
});

router.get('/:payment_plan_id', async (req, res) => {
  try {
    let payment_plan = await PaymentPlanService.find_by_id(req.params.payment_plan_id);
    ReS(res, {
      payment_plan
    });
  } catch (err) {
    ReE(res, err);
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    if(req.auth.role != USER_ROLES.ADMIN) TE(ERRORS.UNAUTHORIZED_USER);
    else {
      let payment_plan = await PaymentPlanService.create(req.body);
      ReS(res, {
        payment_plan
      });
    }
  } catch (err) {
    ReE(res, err);
  }
});

router.put('/:payment_plan_id', authenticate, async (req, res) => {
  try {
    if(req.auth.role != USER_ROLES.ADMIN) TE(ERRORS.UNAUTHORIZED_USER);
    else {
      let payment_plan = await PaymentPlanService.update(req.params.payment_plan_id, req.body);
      ReS(res, {
        payment_plan
      });
    }
  } catch (err) {
    ReE(res, err);
  }
});

module.exports = router;