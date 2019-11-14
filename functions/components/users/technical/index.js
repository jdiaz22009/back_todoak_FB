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





// send notification
router.post('/notifficacion/push/:role', controller.sendNotificationPush)





module.exports = router