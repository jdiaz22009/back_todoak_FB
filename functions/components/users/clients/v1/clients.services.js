'use strict'
const moment = require('../../../../settings/utils/shared/moments/moments')
const bcrypt = require('bcrypt')
const services = {}
//model schema mongoose
const clientSchema = require('../clients.model').clientSchema
const pushNotificationsSchema = require('../clients.model').pushNotificacionWebSchema


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

services.loginClients = data => new Promise((resolve, reject) => {
  clientSchema.findOne({ email: data['email'] }).exec((err, findUser) => {
    if (err) {
      reject({
        code: 500,
        status: "Internal server error",
        error
      })
    } else {
      if (findUser) {
        let password = bcrypt.compareSync(data['password'], findUser['password'])
        if (!password) {
          const token = new pushNotificationsSchema({
            firetoken: data['firetoken'],
            platform: data['platform'],
            usertype: data['role'],
            uuid: data['uuid']
          })

          pushNotificationsSchema.findOne({ uuid: data['uuid'] }).exec((err, pushNoti) => {
            if (err) {
              reject({
                code: 500,
                status: "Error server internal",
                err,
                ok: false
              })
            } else {
              if (pushNoti) {
                PushNotifications.findByIdAndUpdate(
                  pushNoti['_id'],
                  { firetoken: data['firetoken'] },
                  { new: true },
                  (err, updatePush) => {
                    if (err) {
                      reject({
                        code: 500,
                        status: 'Error server internal',
                        err,
                        ok: false
                      })
                    } else {
                      User.findByIdAndUpdate(
                        findUser['_id'],
                        { tokens: updatePush['_id'] },
                        { new: true },
                        (err, userUpdate) => {
                          if (err) {
                            reject({
                              code: 500,
                              status: 'Error server internal',
                              err,
                              ok: false
                            })
                          } else {
                            console.log(JSON.stringify(userUpdate));
                          }
                        }
                      )
                    }
                  }
                )
              } else {
                pushNotificationsSchema.create(token, (err, createToken) => {
                  if (err) {
                    reject({
                      code: 500,
                      status: 'Error server internal',
                      err,
                      ok: false
                    });
                  } else {
                    clientSchema.findByIdAndUpdate(
                      createUser['_id'],
                      { tokens: createToken['_id'] },
                      { new: true },
                      (err, userUpdate) => {
                        if (err) {
                          reject({
                            code: 500,
                            status: 'Error server internal',
                            err,
                            ok: false
                          });
                        } else {
                          console.log(JSON.stringify(userUpdate));
                        }
                      }
                    );
                  }
                });
              }
            }
          })
        }
        return resolve({
          code: 200,
          status: "OK",
          findUser
        })
      } else {
        resolve({
          code: 404,
          status: "not found",
          message: "El usuario no existe"
        })
      }
    }
  })
})


services.getAllClient = () => new Promise((resolve, reject) => {
  clientSchema.find({ isActive: true }).exec((err, result) => {
    if (err) {
      const error = {
        ok: false,
        status: 500,
        err
      };
      return reject(error);
    }
    return resolve({ db: result, ok: true });
  })
})

services.getByIdClient = id => new Promise((resolve, reject) => {
  clientSchema.findById(id).exec((err, result) => {
    if (err) {
      const error = {
        ok: false,
        status: 500,
        err
      };
      reject(error);
    } else {
      resolve({ db: result, ok: true })
    }
  })
})

services.deleteClients = id => new Promise((resolve, reject) => {
  clientSchema.findByIdAndUpdate(id, { isActive: false }, function (error, objUser) {
    if (error) {
      reject(error);
    } else {
      resolve({ ok: true });
    }
  })
})

services.editProfile = (data) => new Promise((resolve, reject) => {
  let body = {
    name: data['name'],
    lastname: data['lastname'],
    identification: data['identification'],
    phone: data['phone'],
    img: data['img']
  };
  clientSchema.findByIdAndUpdate(data['id'], body, { new: true }).exec((err, success) => {
    if (err) {
      const error = {
        ok: false,
        status: 500,
        err
      };
      reject(error);
    } else {
      resolve({ db: success, ok: true });
    }
  })
})

services.updateClient = data => new Promise((resolve, reject) => {
  let body = {
    name: data['name'],
    lastname: data['lastname'],
    identification: data['identification'],
    phone: data['phone'],
    img: data['img'],
    password: data['password'],
    address_gps: data['address_gps'],
    address: data['address'],
    phone_mobile: body['phone_mobile'],
    city: body['pais'],
    department: body['departamento'],
    city_residence: body['city_residence'],
    created_at: moment.format()
  };
  User.findByIdAndUpdate(data['id'], body, { new: true }).exec((err, success) => {
    if (err) {
      const error = {
        ok: false,
        status: 500,
        err
      };
      return reject(error);
    } else {
      return resolve({ db: success, ok: true });
    }
  })
})




module.exports = services