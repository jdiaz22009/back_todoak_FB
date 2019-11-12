'use strict'
const service = require('./technical.services')
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




module.exports = controller