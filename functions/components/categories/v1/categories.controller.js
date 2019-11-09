'use strict'
const service = require('./categories.services')
const controller = {}

controller.createdCategorie = (req, res) => {
    const { body } = req
    return service.createCategories(body)
        .then(response => res.json(response))
        .catch(error => res.status(400).json({
            OK: false,
            code: 400,
            message: 'Error al crear la categoria vacio',
            error,
        }));
}

controller.getCategories = (req, res) => {
    return service.getCategories()
        .then(response => res.json(response))
        .catch(error => res.status(400).json({
            ok: false,
            code: 400,
            message: 'Error al traer las Sub categorias',
            error
        }));

}

module.exports = controller