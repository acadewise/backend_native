const admin =  require('firebase-admin');

var serviceAccount = require("./firebaseSetting.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

module.exports.admin = admin