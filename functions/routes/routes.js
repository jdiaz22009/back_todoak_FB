'use strict'

//routes import
const categories = require('../components/categories')
const webClients = require('../components/users/clients')

module.exports = app => {
    // router authClients
    app.use('/v1/web', webClients)
    // router categorie
    app.use('/v1/categorie', categories);
}