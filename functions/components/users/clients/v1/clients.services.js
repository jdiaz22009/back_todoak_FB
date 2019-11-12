'use strict'
const moment = require('../../../../settings/utils/shared/moments/moments')
const bcrypt = require('bcrypt')
const services = {}
//model schema mongoose
const clientSchema = require('../clients.model').clientSchema


services.createdClients = data => new Promise((resolve, reject) => {
  data['created_day'] = moment.format('YYYY-MM-DD')
  data['created_month'] = moment.format('YYYY-MM')
  data['created_year'] = moment.format('YYYY')
  data['created_at'] = moment.format()
  data['updated_at'] = moment.format()
  const clients = new clientSchema(data)
  clientSchema.findOne({ identification: data['identification'] })
    .exec((err, userFind) => {
      if (err) {
        reject({
          code: 500,
          status: "Error server internal",
          err,
          ok: false
        });
      } else {
        if (userFind) {
          resolve({
            code: 401,
            status: "WARNING",
            message: "clients already exists",
            ok: true
          });
        } else {
          clients['password'] = bcrypt.hashSync(data['password'], 10);
          clientSchema.create(users, (err, createUser) => {
            if (err) {
              reject({
                code: 500,
                status: 'Error server internal',
                err,
                ok: false
              });
            } else {
              resolve({
                code: 200,
                status: 'OK',
                message: 'Clients saved succesfull',
                ok: true,
                createUser
              });
            }
          });
        }
      }
    })
})


module.exports = services