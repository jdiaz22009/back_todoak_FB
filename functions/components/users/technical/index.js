'use strict'

const { Router } = require('express')

//controller technical
const controller = require('./v1/technical.controller')

const router = new Router()

// Technical
router.post('/register', controller.createdTechnical)
router.post('/login', controller.loginTechnical)
router.get('/get-locations/:id_cliente', controller.getLocations)
router.put('/change-status/:id_tecnico', controller.changestatus)
router.get('/tecni-diponible/:state/:stateConect', controller.technicalAvailable)
router.get('/get-users', controller.getAllUser)
router.get('/get-users-client', controller.getAllUserClient)
router.post('/acept-tecnico/:id', controller.acceptTechnical)

router.get('/get-tecnicos-new', controller.getAllTechnicalNew);
router.get('/get-tecnicos', controller.getAllTechnical)
router.get('/get-tecnicos-libre', controller.getAllTechnicalFree)
router.get('/get-tecnico/:id', controller.getTechnical)
router.get('/get-tecnicos-act', controller.getTechnicalAct)

router.post('/rrhh/create', controller.newRRHH)
router.get('/rrhh/getrrhh/:id', controller.getRRHH)
router.get('/rrhh/getrrhh/', controller.getAllRRHH)

router.post('/changestate/:id', controller.changeState)

router.get('/create/admin', controller.createAdmin)
router.post("/login/admin", controller.loginAdmin)












// send notification
router.post('/notifficacion/push/:role', controller.sendNotificationPush)





module.exports = router