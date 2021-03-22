const { PaymentTransaction } = require("../../models");

const CrudService = require("./crud.service");

class PaymentTransactionService extends CrudService {
    constructor() {
        super(PaymentTransaction);
    }
}

module.exports = new PaymentTransactionService();