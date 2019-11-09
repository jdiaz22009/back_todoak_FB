const { Router } = require('express')

// controller categories
const controller = require('./v1/categories.controller')

const router = new Router()

router.post('/new-category', controller.createdCategorie)
router.get('/get-categorie', controller.getCategories)

module.exports = router