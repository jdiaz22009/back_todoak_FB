'use strict'

const { Router } = require('express')

//controller technical
const controller = require('./v1/technical.controller')

const router = new Router()

router.post('/register', controller.createdTechnical)
router.post('/login', controller.loginTechnical)

router.get('/get-locations/:id_cliente', controller.getLocations);






module.exports = router