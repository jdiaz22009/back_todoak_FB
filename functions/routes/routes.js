'use strict'

//routes import
const categories = require('../components/categories')
const webClients = require('../components/users/clients')
const technical = require('../components/users/technical')

module.exports = app => {
    // auth technical
    app.use('/v1/auth', technical)
    // router authClients
    app.use('/v1/web', webClients)
    // router categorie
    app.use('/v1/categorie', categories);
}