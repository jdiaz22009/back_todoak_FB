'use strict'
const service = require('./services')
const controller = {}

controller.createService = (req, res) => {
  const { body } = req;
  return service
    .createServi(body)
    .then(response => res.send(response))
    .catch(error =>
      res.status(400).json({
        ok: false,
        message: "Error al crear el servicio",
        error
      })
    )
}

controller.createServiceWeb = (req, res) => {
  const { body } = req;
  return service
    .createServiceWeb(body)
    .then(response => res.send(response))
    .catch(error =>
      res.status(400).json({
        ok: false,
        message: "Error al crear el servicio web",
        error
      })
    )
}

controller.getService = (req, res) => {
  const { id_tecnico } = req.params
  return service
    .getService(id_tecnico)
    .then(response => res.json(response))
    .catch(error =>
      res.status(400).json({
        ok: false,
        message: "Error al cargar el servicio",
        error
      })
    )
}

controller.getServiceWeb = (req, res) => {
  const { id_tecnico } = req.params;
  return service
    .getServiceWeb(id_tecnico)
    .then(response => res.json(response))
    .catch(error =>
      res.status(400).json({
        ok: false,
        message: "Error al cargar el servicio",
        error
      })
    )
}

controller.createTecnicoPostula = (req, res) => {
  const { body, params } = req;
  return service
    .tecnicoIncribeService(params, body)
    .then(response => res.send(response))
    .catch(error => res.send(error))
}

controller.createTecnicoPostulaWeb = (req, res) => {
  const { body, params } = req
  return service
    .tecnicoIncribeServiceWeb(params, body)
    .then(response => res.send(response))
    .catch(error => res.send(error))

}

controller.getPrice = (req, res) => {
  const { id_service } = req.params
  return service
    .getServicePrice(id_service)
    .then(response => res.send(response))
    .catch(error =>
      res.status(400).json({
        ok: false,
        message: "error al traer el precio del servicio",
        error
      })
    )
}

controller.getPriceWeb = (req, res) => {
  const { id_service } = req.params;
  return service
    .getPriceWeb(id_service)
    .then(response => res.send(response))
    .catch(error =>
      res.status(400).json({
        ok: false,
        message: "error al traer el precio del servicio",
        error
      })
    )
}

controller.updateState = (req, res) => {
  const { body } = req
  const { id_service } = req.params
  return service
    .updatestate(id_service, body)
    .then(response => res.send(response))
    .catch(error =>
      res.status(400).json({
        ok: false,
        message: "error",
        error
      })
    )
}

controller.updateState = (req, res) => {
  const { body } = req
  const { id_service } = req.params
  return service
    .updatestate(id_service, body)
    .then(response => res.send(response))
    .catch(error =>
      res.status(400).json({
        ok: false,
        message: "error",
        error
      })
    )
}

controller.updateTomado = (req, res) => {
  const { body } = req;
  const { id_service } = req.params;
  return service
    .updatestate(id_service, body)
    .then(response => res.send(response))
    .catch(error =>
      res.status(400).json({
        ok: false,
        message: "error",
        error
      })
    )
}

controller.updateTomadoWeb = (req, res) => {
  const { body } = req
  const { id_service } = req.params
  return service
    .updateTomadoWeb(id_service, body)
    .then(response => res.send(response))
    .catch(error =>
      res.status(400).json({
        ok: false,
        message: "error",
        error
      })
    )
}

controller.getMyservice = (req, res) => {
  const { id_tecnico } = req.params;
  return service
    .getmyservice(id_tecnico)
    .then(response => res.send(response))
    .catch(error =>
      res.status(400).json({
        ok: false,
        message: "error al cargar servicios",
        error
      })
    )
}

controller.getMyserviceWeb = (req, res) => {
  const { id_tecnico } = req.params;
  return service
    .getMyserviceWeb(id_tecnico)
    .then(response => res.send(response))
    .catch(error =>
      res.status(400).json({
        ok: false,
        message: "error al cargar servicios",
        error
      })
    )
}

controller.getServiceApla = (req, res) => {
  const { params } = req;
  return service
    .getServicesA(params["id"])
    .then(response => res.send(response))
    .catch(error =>
      res.status(400).json({
        ok: false,
        message: "error al cargar servicios",
        error
      })
    )
}

controller.updateStateTecnico = (req, res) => {
  const { id_service } = req.params
  const { body } = req
  return service
    .updateStateTecnico(id_service, body)
    .then(response => res.send(response))
    .catch(error =>
      res.status(400).json({
        ok: false,
        message: "error",
        error
      })
    )
}

controller.updateStateTecnicoWeb = (req, res) => {
  const { id_service } = req.params
  const { body } = req
  return service
    .updateStateTecnicoWeb(id_service, body)
    .then(response => res.send(response))
    .catch(error =>
      res.status(400).json({
        ok: false,
        message: "error",
        error
      })
    )
}

controller.getMyserviCliente = (req, res) => {
  const { id } = req.params
  return service
    .MyserviceCliente(id)
    .then(response => res.send(response))
    .catch(error =>
      res.status(400).json({
        ok: false,
        message: "error",
        error
      })
    )
}

controller.getMyserviClienteWeb = (req, res) => {
  const { id } = req.params
  return service
    .MyserviceClienteWeb(id)
    .then(response => res.send(response))
    .catch(error =>
      res.status(400).json({
        ok: false,
        message: "error",
        error
      })
    )
}


controller.CancelServiceTecnico = (req, res) => {
  const { id_service } = req.params;
  const { body } = req;
  return service
    .cancelService(id_service, body)
    .then(response => res.json(response))
    .catch(error =>
      res.status(400).json({
        ok: false,
        message: "Error",
        error
      })
    )
}

controller.CancelServiceTecnicoWeb = (req, res) => {
  const { id_service } = req.params;
  const { body } = req;
  return service
    .CancelServiceTecnicoWeb(id_service, body)
    .then(response => res.json(response))
    .catch(error =>
      res.status(400).json({
        ok: false,
        message: "Error",
        error
      })
    )
}

controller.UpdateUrlPhoto = (req, res, next) => {
  const { body } = req
  const { id, id_service } = req.params
  return service
    .updateUrlPhotos(body, id, id_service)
    .then(response => res.json(response))
    .catch(error =>
      res.status(400).json({
        ok: false,
        message: "Error",
        error
      })
    )
}


controller.UpdateUrlWebPhoto = (req, res, next) => {
  const { body } = req;
  const { id, id_service } = req.params;
  return service
    .UpdateUrlWebPhoto(body, id, id_service)
    .then(response => res.json(response))
    .catch(error =>
      res.status(400).json({
        ok: false,
        message: "Error",
        error
      })
    )
}

controller.UpdateUrlPhotoFin = (req, res, next) => {
  const { body } = req;
  const { id, id_service } = req.params;
  return service
    .updateUrlPhotosFin(body, id, id_service)
    .then(response => res.json(response))
    .catch(error =>
      res.status(400).json({
        ok: false,
        message: "Error",
        error
      })
    )
}

controller.UpdateUrlWebPhotoFin = (req, res, next) => {
  const { body } = req
  const { id, id_service } = req.params
  return service
    .UpdateUrlWebPhotoFin(body, id, id_service)
    .then(response => res.json(response))
    .catch(error =>
      res.status(400).json({
        ok: false,
        message: "Error",
        error
      })
    )
}

controller.cancelCLientService = (req, res, next) => {
  const { body } = req;
  const { id_client, id_service } = req.params;
  return service
    .cancelServicesClient(id_client, id_service, body)
    .then(response => res.json(response))
    .catch(e => res.json(e))
}

controller.asignacionTecnico = (req, res) => {
  const { body, params } = req
  return service
    .asignacionTecnico(body, params)
    .then(response => res.json(response))
    .catch(error =>
      res.status(400).json({
        ok: false,
        message: "error",
        error
      })
    )
}

controller.asignacionTecnicoWeb = (req, res) => {
  const { body, params } = req;
  return service
    .asignacionTecnicoWeb(body, params)
    .then(response => res.json(response))
    .catch(error =>
      res.status(400).json({
        ok: false,
        message: "error",
        error
      })
    )
}

controller.aplazarServicioWeb = (req, res) => {
  const { body } = req;
  const { id_service } = req.params;
  return service
    .aplazarServicioWeb(id_service, body)
    .then(response => res.send(response))
    .catch(error =>
      res.status(400).json({
        ok: false,
        message: "error al aplazar el servicio",
        error
      })
    )
}

controller.getServicePanelweb = (req, res) => {
  return service
    .getServiceImage()
    .then(response => res.send(response))
    .catch(error =>
      res.status(400).json({
        ok: false,
        message: "error al cargar el servicio",
        error
      })
    )
}

controller.getServicesWeb = (req, res) => {
  return service
    .getServicesWeb()
    .then(response => res.send(response))
    .catch(error =>
      res.status(400).json({
        ok: false,
        message: "error al cargar el servicio",
        error
      })
    )
}

controller.update_price = (req, res) => {
  const { body } = req;
  const { id_service } = req.params;
  return service
    .updateprice(id_service, body)
    .then(response => res.send(response))
    .catch(error =>
      res.status(400).json({
        ok: false,
        message: "error al crear el precio de la cotizacion",
        error
      })
    )
}

controller.update_price_web = (req, res) => {
  const { body } = req;
  const { id_service } = req.params;
  return service
    .update_price_web(id_service, body)
    .then(response => res.send(response))
    .catch(error =>
      res.status(400).json({
        ok: false,
        message: "error al crear el precio de la cotizacion",
        error
      })
    )
}

controller.getAllServices = (req, res) => {
  return service
    .getAllServices()
    .then(response => res.send(response))
    .catch(error =>
      res.status(400).json({
        ok: false,
        message: "error al cargar servicios",
        error
      })
    )
}

controller.getAllServicesWeb = (req, res) => {
  return service
    .getAllServicesWeb()
    .then(response => res.send(response))
    .catch(error =>
      res.status(400).json({
        ok: false,
        message: "error al cargar servicios",
        error
      })
    )
}

controller.getServicesWebByID = (req, res) => {
  const id = req.params.id;
  return service
    .getServicesWebByID(id)
    .then(response => res.send(response))
    .catch(error =>
      res.status(400).json({
        ok: false,
        message: "error al cargar el servicio",
        error
      })
    )
}

controller.getServiceByID = (req, res) => {
  const id = req.params.id;
  return service
    .getServiceByID(id)
    .then(response => res.send(response))
    .catch(error =>
      res.status(400).json({
        ok: false,
        message: "error al cargar el servicio",
        error
      })
    )
}

controller.saveUpdatePostpone = (req, res, next) => {
  const { body } = req;
  return service
    .saveUpdatePostpone(body)
    .then(response => res.send(response))
    .catch(error => res.status(500).send(error))
}

controller.addListA = (req, res, next) => {
  const { body } = req;
  return service
    .addListA(body)
    .then(response => res.send(response))
    .catch(error => res.status(500).send(error))
}
controller.getListA = (req, res, next) => {
  const { params } = req
  return service
    .getListA(params)
    .then(response => res.send(response))
    .catch(error => res.status(500).send(error));
}


module.exports = controller