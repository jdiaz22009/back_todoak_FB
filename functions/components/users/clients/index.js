'use strict'
const { Router } = require('express')

// constroller Clients
const controller = require('./v1/clients.controller')

const router = new Router()

// router clients
router.post('/register', controller.createdClients);


module.exports = router