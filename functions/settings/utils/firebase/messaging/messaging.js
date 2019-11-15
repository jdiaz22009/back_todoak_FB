'use strict'
const firebaseAdmin = require('firebase-admin')
const serviceAccount = require('../json/service_account.json')
const firebase = {}

//init app firebase
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: `https://todoakrefactor.firebaseio.com/`
})

firebase.messagingSendToDevice = (notification, data, tokens) => new Promise((resolve, reject) => {
  var message = {
    notification,
    data
  }
  firebaseAdmin.messaging().sendToDevice(tokens, message)
    .then((response) => resolve({ message: response, data: message }))
    .catch((error) => reject(error))
})

module.exports = firebase