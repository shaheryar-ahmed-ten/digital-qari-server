const { PaymentTransaction } = require("../../models");
const { TE } = require("../../utils/helpers");

const CrudService = require("./crud.service");

const {cko} = require("../../utils/checkout.init");

class PaymentTransactionService extends CrudService {
    constructor() {
        super(PaymentTransaction);
    }

    async create(obj, options) {
        try {
            if(obj["student"]) {
                let student = obj["student"];
                let card_token = student["card_token"];
                const payment = await cko.payments.request({
                    source: {
                        token: card_token,
                    },
                    customer: {
                        email: student.user.email,
                        name: student.name,
                    },
                    currency: 'PKR',
                    amount: ~~obj["amount"]*100, // cents
                    reference: ""+obj["booking"],
                });
                obj["data"] = payment;
            } else {
                obj["data"] = {}; //required for payment_type: qari
            }
            return super.create(obj, options);
        } catch(err) {
            TE(err);
        }
    }
}

module.exports = new PaymentTransactionService();