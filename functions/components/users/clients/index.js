'use strict'
const { Router } = require('express')

// constroller Clients
const controller = require('./v1/clients.controller')

const router = new Router()

// router clients
router.post('/register', controller.createdClients)
router.post('/login', controller.loginClients)
router.post('/delete/:id', controller.deleteClients)

router.post('/edictInformation', controller.editProfile)
router.post('/cliente', controller.updateClient)

router.get('/get-users', controller.getAllClient)
router.get("/get-user/:id", controller.getByIdClient)




module.exports = router