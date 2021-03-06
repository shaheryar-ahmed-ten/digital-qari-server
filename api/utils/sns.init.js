const {TE} = require("./helpers");

const {AWS} = require("./aws.init");

const SNS = new AWS.SNS({apiVersion: '2010-03-31'});

async function send_sms(phone_number, message) {
  try {
    const data = await SNS.publish({
      Message: message,
      PhoneNumber: phone_number
    }).promise();

    return data;
  } catch(err) {
    TE(err);
  }
}

module.exports = {
  send_sms
};