'use strict'
const { Router } = require('express')

//controller
const controller = require('./v1/controller.services')

//routes

const router = new Router()

router.post('/create-service', controller.createService)
router.post('/create-service-web', controller.createServiceWeb)
router.get('/getService/:id_tecnico', controller.getService)
router.get('/getServiceWeb/:id_tecnico', controller.getServiceWeb)
router.put('/create-service-tecnico/:serviceid', controller.createTecnicoPostula)
router.put('/create-service-tecnico-web/:serviceid', controller.createTecnicoPostulaWeb)
router.get('/get-price/:id_service', controller.getPrice)
router.get('/get-price-web/:id_service', controller.getPriceWeb)
router.put('/update-state/:id_service', controller.updateState)
//router.put('/update-state-web/:id_service', controller.updateStateWeb)
router.put('/update-tomado/:id_service', controller.updateTomado)
router.put('/update-tomado-web/:id_service', controller.updateTomadoWeb)
router.get('/my-service/:id_tecnico', controller.getMyservice)
router.get('/my-service-web/:id_tecnico', controller.getMyserviceWeb)
router.get('/my-serviceA/:id', controller.getServiceApla)
router.put('/update-empezar/:id_service', controller.updateStateTecnico)
router.put("/update-empezar-web/:id_service", controller.updateStateTecnicoWeb)
router.get("/get-my-service-client/:id", controller.getMyserviCliente)
router.get("/get-my-service-client-web/:id", controller.getMyserviClienteWeb)
router.put("/service-cancel/:id_service", controller.CancelServiceTecnico)
router.put("/service-cancel-web/:id_service", controller.CancelServiceTecnicoWeb)
router.put("/updateUrl/:id/:id_service", controller.UpdateUrlPhoto)
router.put("/updateUrl-web/:id/:id_service", controller.UpdateUrlWebPhoto)
router.put("/updateUrlFin/:id/:id_service", controller.UpdateUrlPhotoFin)
router.put("/updateUrlFin-web/:id/:id_service", controller.UpdateUrlWebPhotoFin)
router.put("/cancelServiceClient/:id_client/:id_service", controller.cancelCLientService)

router.put("/assignTechnical/:id", controller.asignacionTecnico)
router.put("/assignTechnicalWeb/:id", controller.asignacionTecnicoWeb)
router.put("/aplazarServicioWeb/:id_service", controller.aplazarServicioWeb)
router.get("/get-servicio-panel-web", controller.getServicePanelweb)
router.get("/get-servicios-web", controller.getServicesWeb)
router.put("/update-price/:id_service", controller.update_price)
router.put("/update-price-web/:id_service", controller.update_price_web)
router.get("/get-services", controller.getAllServices)
router.get("/get-services-web", controller.getAllServicesWeb)
router.get("/get-services-web/:id", controller.getServicesWebByID)
router.get("/get-services/:id", controller.getServiceByID)
router.put("/saveAplazar", controller.saveUpdatePostpone)
router.put("/addListA", controller.addListA)
router.get("/getlistA/:id", controller.getListA); // falta

module.exports = router