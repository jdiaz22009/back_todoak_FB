'use strict'
const service = require('./technical.services')

const sendTodevices = require('../../../../settings/utils/firebase/messaging/messaging')


const controller = {}

controller.createdTechnical = (req, res) => {
  const { body } = req;
  return service.createdTechnical(body)
    .then(response => res.status(200).json(response))
    .catch(error => res.status(500).json(error))
}

controller.loginTechnical = (req, res) => {
  const { body } = req;
  return service.loginTechnical(body)
    .then(result => res.status(200).json(result))
    .catch(err => res.status(500).json(err))
}

controller.getLocations = (req, res) => {
  const { params } = req;
  return service.getLocation(params['id_cliente'])
    .then(result => res.status(200).json(result))
    .catch(error =>
      res.status(400).json({
        message: "Error",
        error
      })
    )
}

controller.changestatus = function (req, res) {
  const { params, body } = req;
  return service.changeStatus(params['id_tecnico'], body)
    .then(response => res.json(response))
    .catch(error => res.status(400).json(error));
}

controller.technicalAvailable = (req, res) => {
  const { params } = req;
  return service.technicalAvailable(params)
    .then(response => res.send(response))
    .catch(error => res.status(400).json(error))
}

controller.getAllUser = (req, res) => {
  return service.getAllUser()
    .then(result => res.json(result))
    .catch(err => res.status(500).json(err))
}

controller.getAllUserClient = (req, res) => {
  return service.getAllUserClient()
    .then(result => res.json(result))
    .catch(err => res.status(500).json(err))
}


controller.getTechnical = (req, res) => {
  const { params } = req;
  return service.getTechnical(params['id'])
    .then(result => res.json(result))
    .catch(err => res.status(500).json(err))
}

controller.getAllTechnical = (req, res) => {
  return service.getAllTechnical()
    .then(result => res.json(result))
    .catch(err => res.status(500).json(err))
}

controller.getAllTechnicalFree = (req, res) => {
  return service.getAllTechnicalFree()
    .then(result => res.json(result))
    .catch(err => res.status(500).json(err))
}


controller.getTechnicalAct = (req, res) => {
  return service.getTechnicalAct()
    .then(result => res.json(result))
    .catch(err => res.status(500).json(err))
}

controller.getAllTechnicalNew = (req, res) => {
  return service.getAllTechnicalNew()
    .then(result => res.json(result))
    .catch(err => res.status(500).json(err))
}


controller.acceptTechnical = (req, res) => {
  const { params } = req
  return service.acceptTechnical(params['id'])
    .then(response => res.send(response))
    .catch(error => res.status(400).json(error))
}


controller.newRRHH = (req, res) => {
  const { body } = req;
  return service.newRRHH(body)
    .then(result => res.json(result))
    .catch(err => res.status(err.status).json(err))
}

controller.getRRHH = (req, res) => {
  const { params } = req;
  return service.getRRHH(params['id'])
    .then(result => res.json(result))
    .catch(err => res.status(500).json(err))
}

controller.getAllRRHH = (req, res) => {
  return service.getAllRRHH()
    .then(result => res.json(result))
    .catch(err => res.status(500).json(err))
}



controller.changeState = (req, res) => {
  const { body, params } = req
  return service.changeState(params['id'], body)
    .then(response => res.send(response))
    .catch(error => res.status(400).json(error))
}

controller.createAdmin = (req, res) => {
  const token = req.params.token;
  return service.createAdmin(token)
    .then(response => res.send(response))
    .catch(error => res.status(400).json(error))
}

controller.loginAdmin = (req, res) => {
  const body = req.body;
  return service.loginAdmin(body)
    .then(response => res.send(response))
    .catch(error => res.status(400).json(error));
}

// send notification
controller.sendNotificationPush = (req, res) => {
  const { params, body } = req
  if (params['role'] === "3") {
    service.notification(params['role'], body)
      .then((notification, payload, tokens) => sendTodevices.messagingSendToDevice(notification, payload, tokens))
      .catch((err) => res.status(500).send(err))
  } else {
    res.status(406).send('No es un rol valido')
  }
}



module.exports = controller