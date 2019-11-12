const categories = require('../categories.model').categorieSchema
const subCategories = require('../categories.model').subCategorieSchema
const moment = require('moment')
const currentTime = moment().format('X')

const services = {}


//services categories
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

services.getSearchCheck = data => new Promise((resolve, reject) => {
  categories.findById(data)
    .populate({ path: 'id_subcategory', model: subCategories })
    .exec((err, finCa) => {
      if (err) {
        reject({ ok: false, status: 500, message: 'Internal serve error', err })
      } else {
        resolve({ ok: true, status: 200, message: 'OK', finCa })
      }
    })
})


// services subCategories
services.createSubcategorie = data => new Promise((resolve, reject) => {
  subCategories.findOne({
    id_category: data['id_category']
  }).exec((err, findSub) => {
    if (err) {
      reject({
        ok: false,
        code: 500,
        message: 'Error internal serve'
      })
    } else {
      if (findSub) {
        const body = {
          name: data['SubCategorie']['name'],
          desc: data['SubCategorie']['desc']
        }
        subCategories.findByIdAndUpdate(findSub['_id'], { $push: { SubCategorie: body } }, { new: true })
          .exec((err, succes) => {
            if (err) {
              reject({
                ok: false,
                status: 400,
                err
              })
            } else {
              resolve({
                ok: true,
                status: 200,
                succes
              })
            }
          })
      } else {
        const subCatego = new subCategories(data)
        subCategories.create(subCatego, function (err, success) {
          if (err) {
            reject({
              ok: false,
              status: 400,
              message: "error al crear la subcategoria",
              err
            })
          } else {
            categories.findByIdAndUpdate(data['id_category'], { id_subcategory: success['_id'] }, { new: true })
              .exec((error, cateUpdate) => {
                if (error) {
                  const err = {
                    ok: false,
                    status: 400,
                    message: "error",
                    error
                  };
                  reject(err);
                } else {
                  const succe = {
                    ok: true,
                    status: 200,
                    success: cateUpdate
                  };
                  resolve(succe);
                }
              })
          }
        })
      }
    }
  })
})


services.isActive = (id_sub, data) => new Promise((resolve, reject) => {
  subCategories.findByIdAndUpdate(id_sub, data, { new: true })
    .exec((err, succes) => {
      if (err) {
        const fail = {
          ok: false,
          status: 400,
          err
        };
        return reject(fail);
      } else {
        const success = {
          ok: true,
          status: 200,
          succes
        };
        return resolve(success);
      }
    })
})

services.getSubcategorieAll = () => new Promise((resolve, reject) => {
  subCategories.find({}).exec((err, subCategorie) => {
    if (error) {
      const fail = {
        ok: false,
        code: 400,
        message: "error",
        err
      };
      reject(fail);
    } else {
      const succes = {
        ok: true,
        code: 200,
        subCategorie
      };
      resolve(succes);
    }
  })
})

services.getSubCategoriesByIdCategorie = id => new Promise((resolve, reject) => {
  subcategori.find({ id_category: id }).exec((error, subCategorie) => {
    if (error) {
      const fail = {
        ok: false,
        code: 400,
        message: "error",
        error
      };
      reject(fail);
    } else {
      const succes = {
        ok: true,
        code: 200,
        subCategorie
      };
      resolve(succes);
    }
  })
})

module.exports = services