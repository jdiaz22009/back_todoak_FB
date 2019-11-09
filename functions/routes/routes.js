'use strict'

const categories = require('../components/categories')

//routes import

module.exports = app => {

    
    // route categorie
    app.use("/v1/categorie", categories);

}