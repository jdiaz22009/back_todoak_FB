'use strict'
const service = require('./technical.services')

const sendTodevices = require('../../../../settings/utils/firebase/messaging/messaging')


const controller = {}

controller.createdTechnical = (req, res) => {
  const { body } = req;
  return service.createdTechnical(body)
    .then(response => {
      res.status(200).json(response);
    })
    .catch(error => {
      res.status(500).json(error);
    });
}

controller.loginTechnical = (req, res) => {
  const { body } = req;
  return service.loginTechnical(body)
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(500).json(err);
    });
};

controller.getLocations = (req, res) => {
  const { params } = req;
  return service.getLocation(params['id_cliente'])
    .then(result => res.status(200).json(result))
    .catch(error =>
      res.status(400).json({
        message: "Error",
        error
      })
    );
};


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
    .catch(error => res.status(400).json(error));
}

controller.getAllUser = (req, res) => {
  return service.getAllUser()
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      res.status(err.status).json(err);
    });
};





// send notification

controller.sendNotificationPush = (req, res) => {
  const { params, body } = req
  if (params['role'] === "3") {
    service.notification(params['role'], body)
      .then((notification, payload, tokens) => {
        sendTodevices.messagingSendToDevice(notification, payload, tokens)
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  } else {
    res.status(406).send('No es un rol valido');
  }
};



module.exports = controller