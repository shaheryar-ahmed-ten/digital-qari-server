const { TE } = require("../../utils/helpers");
const { firebase_messaging } = require("../../utils/firebase.init");

module.exports.send_notification = async (token, title, body, data = {}) => {
  try {
    let response = await firebase_messaging.sendToDevice(
      token,
      {
        data,
        notification: {
          title,
          body
        }
      }
    )

    return response;
  } catch (err) {
    TE(err);
  }
}