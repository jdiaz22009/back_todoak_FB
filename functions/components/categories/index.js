'use strict'
const { Router } = require('express')

// controller categories
const controller = require('./v1/categories.controller')

const router = new Router()


//routes categories
router.post('/new-category', controller.createdCategorie)
router.get('/get-categorie', controller.getCategories)
router.get('/getSearchCheck/:id', controller.getSearchCheck)


//routes subcategories
router.post('/new-subcategories', controller.createSubcategorie)
router.post("/update-isactive/:id_sub", controller.isActive)
router.get("/get-categories", controller.getCategorieAll)




module.exports = router