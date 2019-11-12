'use strict'
const service = require('./clients.services')
const controller = {}

controller.createdClients = (req, res) => {
  const { body } = req;
  return service.createdClients(body)
    .then(response => {
      res.status(200).send(response);
    })
    .catch(error => {
      res.status(500).send(error);
    })
}

controller.loginClients = (req, res) => {
  const { body } = req;
  service.loginClients(body)
    .then(result => {
      res.status(200).send(result);
    })
    .catch(err => {
      res.status(500).send(err);
    })
}

controller.getAllClient = (req, res) => {
  service.getAllClient()
    .then(result => {
      res.status(200).send(result);
    })
    .catch(err => {
      res.status(500).send(err);
    })
}

controller.getByIdClient = (req, res) => {
  const { params } = req;
  service.getByIdClient(params['id'])
    .then(result => {
      res.status(200).send(result);
    })
    .catch(err => {
      res.status(500).send(err);
    })
}


controller.editProfile = (req, res) => {
  const { body } = req
  return service.editProfile(body)
    .then(response => res.status(200).send(response))
    .catch(error => res.status(500).send(error));
}



controller.updateClient = (req, res) => {
  const { body } = req
  return service.updateClient(body)
    .then(response => res.status(200).send(response))
    .catch(error => res.status(500).send(error));
}


controller.deleteClients = (req, res) => {
  const { params } = req;
  service.deleteClients(params['id'])
    .then(result => {
      res.status(200).send(result);
    })
    .catch(err => {
      res.status(500).send(err);
    });
};



module.exports = controller