'use strict'

const functions = require('firebase-functions');
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose')
const config = require('./settings/db/database')

const routesConfig = require('./routes/routes')

const app = express()

// settings
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(morgan('dev'))
app.use(cors({ origin: true }))


//CORS ORIGIN MIDELWARE
app.use((req, res, next) => {

  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-API-KEY, Origin, X-Requested-Width, Content-Type, Accept,Access-Control-Request-Method,Authorization,territoken');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header('Allow', 'GET, POST,OPTIONS,PUT,DELETE');
  return next();
})


// connect mongoose
mongoose.connect(config.db.mongodb.atlas, {
  autoIndex: false,
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
})
mongoose.connection.on('connected', () => {
  console.log('Mongoose is connected')
  return true
})

mongoose.connection.on('Disconnected', () => {
  console.log('Mongoose is disconnected')
  return false
})

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose connection is disconnected due to application termination');
    process.exit(0)
  });
  return false
});

routesConfig(app)

exports.api = functions.https.onRequest(app)

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

