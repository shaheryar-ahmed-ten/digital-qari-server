var admin = require("firebase-admin");

var serviceAccount = require("../../digiq-1531b-firebase-adminsdk-kqm20-c2cbaad7b3.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = {
  firebase_messaging: admin.messaging()
}