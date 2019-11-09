const categories = require('../categories.model').categorieSchema
const subCategories = require('../categories.model').subCategorieSchema
const moment = require('moment')
const currentTime = moment().format('X')

const services = {}

services.createCategories = data => new Promise((resolve, reject) => {
    data.create_at = currentTime
    data.updated_at = currentTime

    categories.findOne({ nameCategory: data.nameCategory })
        .exec((err, findCa) => {
            if (err) {
                reject({
                    ok: false,
                    code: 503,
                    message: 'Error',
                    err
                })
            } else {
                if (findCa) {
                    resolve({
                        ok: false,
                        message: 'Ya se encuentra esta categoria',
                        findCa
                    })
                } else {
                    const newCategorie = new categories(data)
                    categories.create(newCategorie, function (err, createC) {
                        if (err) {
                            const error = {
                                ok: false,
                                status: 400,
                                err
                            }
                            reject(error)
                        } else {
                            const save = {
                                ok: true,
                                status: 200,
                                createC
                            }
                            resolve(save)
                        }
                    })
                }
            }
        })
})


services.getCategories = () => new Promise((resolve, reject) => {
    categories.find({})
        .populate({ path: 'id_subcategory', model: subCategories })
        .exec((err, finCate) => {
            if (err) {
                const fail = {
                    ok: false,
                    status: 400,
                    message: 'Problemas al traer la Subcategoria',
                    err
                }
                reject(fail)
            } else {
                const success = {
                    ok: true,
                    status: 200,
                    finCate
                }
                resolve(success)
            }
        })
})

module.exports = services