'use strict'

//routes import
const categories = require('../components/categories')
const webClients = require('../components/users/clients')
const technical = require('../components/users/technical')
const service = require('../components/services')

module.exports = app => {
    // auth technical
    app.use('/v1/auth', technical)

    // router service
    app.use('/v1/auth/service', service);
    // router authClients

    app.use('/v1/web', webClients)
    
    // router categorie
    app.use('/v1/categorie', categories);
}