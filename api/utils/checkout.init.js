const { Checkout } = require('checkout-sdk-node');

const cko = new Checkout(process.env.CKO_SECRET_KEY, {
  pk: process.env.CKO_PUBLIC_KEY
});

module.exports = {
  cko
}