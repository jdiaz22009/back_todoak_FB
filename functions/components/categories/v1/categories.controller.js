'use strict'
const service = require('./categories.services')
const controller = {}
// controller categories
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

controller.getSearchCheck = (req, res) => {
  const { id } = req.params
  return service.getSearchCheck(id)
    .then(response => res.json(response))
    .catch(error => res.status(400).json({
      ok: false,
      code: 500,
      message: 'Error ',
      error
    }));
}


// subcategorie controller

controller.createSubcategorie = (req, res) => {
  const { body } = req
  return service.createSubcategorie(body)
    .then(response => {
      res.json(response)

    })
    .catch(error =>
      res.status(400).json({
        OK: false,
        code: 400,
        message: "Error al crear la Subcategoria",
        error
      })
    );
}

controller.isActive = (req, res) => {
  const { body, params } = req
  return service.isActive(params['id_sub'], body)
    .then(response => res.json(response))
    .catch(error =>
      res.status(400).json({
        ok: false,
        status: 400,
        message: "error",
        error
      })
    );
}

controller.getCategorieAll = (req, res) => {
  return service.getSubcategorieAll()
    .then(response => res.json(response))
    .catch(error =>
      res.status(400).json({
        ok: false,
        code: 400,
        message: "Error al traer las categorias",
        error
      })
    );
}

controller.getSubCategoriesByIdCategorie = (req, res) => {
  const { params } = req
  return service.getSubCategoriesByIdCategorie(params['id'])
    .then(response => res.json(response))
    .catch(error =>
      res.status(400).json({
        ok: false,
        code: 400,
        message: "Error al traer las sub categorias de una categoria",
        error
      })
    );

}



module.exports = controller