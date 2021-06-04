var admin = require("firebase-admin");

var serviceAccount = require("../../digital-qari-firebase-adminsdk-pibqn-de3482eb24.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = {
  firebase_messaging: admin.messaging()
}