const {AWS} = require("./aws.init");

const SES = new AWS.SES({apiVersion: '2010-12-01'});

async function send_email(to, subject, body) {
  try {
    var params = {
      Destination: {
        ToAddresses: [
          to,
        ]
      },
      Message: {
        Body: {
          Html: {
           Charset: "UTF-8",
           Data: body
          }
         },
         Subject: {
          Charset: 'UTF-8',
          Data: subject
         }
        },
      Source: process.env.EMAIL
    };

    const data = await SES.sendEmail(params).promise();
    return data;
  } catch (err) {
    TE(err);
  }
}

module.exports = {
  send_email
};