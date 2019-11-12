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
    });

}


module.exports = controller