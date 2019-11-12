'use strict'
const moment = require('../../../../settings/utils/shared/libs/libs')
const bcrypt = require('bcrypt')

const technicalSchema = require('../technical.model').userTecnicos
const locationsSchema = require('../technical.model').locationsSchema
const RRHSchema = require('../technical.model').StateRRHH
const pushNotificationsSchema = require('../technical.model').pushNotificacion

const services = {}

services.createdTechnical = data => new Promise((resolve, reject) => {

  data['created_date_view'] = moment.format('YYYY-MM-DD HH:mm:ss')
  data['created_day'] = moment.format('YYYY-MM-DD')
  data['created_month'] = moment.format('YYYY-MM')
  data['created_year'] = moment.format('YYYY')
  data['created_at'] = moment.format('X')
  data['updated_at'] = moment.format('X')

  if (data['role'] === 3) {
    data['worker'] = false
  } else {
    data['worker'] = true
  }

  const technicalS = new technicalSchema(data)

  technicalSchema.findOne({ email: data['email'] }).exec((err, userFind) => {
    if (err) {
      return reject({
        code: 500,
        status: 'Error server internal',
        err,
        ok: false
      });
    } else {
      if (userFind) {
        return resolve({
          code: 200,
          status: 'OK',
          message: 'User already exists',
          ok: true
        });
      } else {
        technicalS['password'] = bcrypt.hashSync(data['password'], 10);
        technicalSchema.create(technicalS, (err, createUser) => {
          if (err) {
            return reject({
              code: 500,
              status: 'Error server internal',
              err,
              ok: false
            });
          } else {
            const token = new pushNotificationsSchema({
              firetoken: data['firetoken'],
              platform: data['platform'],
              usertype: data['role'],
              uuid: data['uuid']
            });
            pushNotificationsSchema.findOne({ uuid: data['uuid'] }).exec(
              (err, pushNoti) => {
                if (err) {
                  return reject({
                    code: 500,
                    status: 'Error server internal',
                    err,
                    ok: false
                  });
                } else {
                  if (pushNoti) {
                    pushNotificationsSchema.findByIdAndUpdate(
                      pushNoti['_id'],
                      { firetoken: data['firetoken'] },
                      { new: true },
                      (err, updatePush) => {
                        if (err) {
                          return reject({
                            code: 500,
                            status: 'Error server internal',
                            err,
                            ok: false
                          });
                        } else {
                          technicalSchema.findByIdAndUpdate(
                            createUser['_id'],
                            { tokens: updatePush['_id'] },
                            { new: true },
                            (err, userUpdate) => {
                              if (err) {
                                return reject({
                                  code: 500,
                                  status: 'Error server internal',
                                  err,
                                  ok: false
                                });
                              } else {
                                console.log("push token", userUpdate);
                              }
                            }
                          );
                        }
                      }
                    );
                  } else {
                    pushNotificationsSchema.create(token, (err, createToken) => {
                      if (err) {
                        return reject({
                          code: 500,
                          status: 'Error server internal',
                          err,
                          ok: false
                        });
                      } else {
                        technicalSchema.findByIdAndUpdate(
                          createUser['_id'],
                          { tokens: createToken['_id'] },
                          { new: true },
                          (err, userUpdate) => {
                            if (err) {
                              return reject({
                                code: 500,
                                status: 'Error server internal',
                                err,
                                ok: false
                              });
                            } else {
                              console.log("push token", userUpdate);
                            }
                          }
                        );
                      }
                    });
                  }
                }
              }
            );
            if (data['role'] === 2) {
              var location = new locationsSchema({
                nameLocation: data['nameLocation'],
                addressLocation: data['addressLocation'],
                lat: data['lat'],
                lng: data['lng']
              });
              locationsSchema.create(location, (err, createLocation) => {
                if (err) {
                  return reject({
                    message: "Error, por favor espere",
                    code: 504,
                    ok: false
                  });
                } else {
                  technicalSchema.findByIdAndUpdate(
                    createUser['_id'],
                    { $push: { address: createLocation['_id'] } },
                    { new: true },
                    function (error, update) {
                      if (error) {
                        return reject({
                          message: 'Error de actualizacion',
                          code: 504,
                          ok: false
                        });
                      } else {
                        console.log(
                          "Registro exitoso",
                          JSON.stringify(update)
                        );
                      }
                    }
                  );
                }
              });
            }
            return resolve({
              code: 200,
              status: "OK",
              createUser
            })
          }
        });
      }
    }
  });
})

services.loginTechnical = data => new Promise((resolve, reject) => {
  technicalSchema.findOne({ email: data['email'] })
    .populate({ path: 'estado_rrhh', model: RRHSchema })
    .exec((err, findUser) => {
      if (err) {
        reject({
          code: 500,
          status: 'Internal server error',
          error
        });
      } else {
        if (findUser) {
          let password = bcrypt.compareSync(
            data['password'],
            findUser['password']
          );
          if (!password) {
            resolve({
              code: 400,
              status: 'Bad Request',
              message: 'invalid credential'
            });
          } else {
            const token = new pushNotificationsSchema({
              firetoken: data['firetoken'],
              platform: data['platform'],
              usertype: data['role'],
              uuid: data['uuid']
            });
            pushNotificationsSchema.findOne({ uuid: data['uuid'] }).exec(
              (err, pushNoti) => {
                if (err) {
                  reject({
                    code: 500,
                    status: 'Error server internal',
                    err,
                    ok: false
                  });
                } else {
                  if (pushNoti) {
                    pushNotificationsSchema.findByIdAndUpdate(
                      pushNoti['_id'],
                      { firetoken: data['firetoken'] },
                      { new: true },
                      (err, updatePush) => {
                        if (err) {
                          reject({
                            code: 500,
                            status: "Error server internal",
                            err,
                            ok: false
                          });
                        } else {
                          technicalSchema.findByIdAndUpdate(
                            findUser['_id'],
                            { tokens: updatePush['_id'] },
                            { new: true },
                            (err, userUpdate) => {
                              if (err) {
                                return reject({
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
                      }
                    );
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
                        technicalSchema.findByIdAndUpdate(
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
              }
            );
            if (findUser['role'] === 3) {
              if (!findUser['worker']) {

                resolve({
                  code: 200,
                  status: "FALSE",
                  message: "El tecnico no ha sido aceptado",
                  findUser
                });

              }
            }
          }

          resolve({
            code: 200,
            status: "OK",
            findUser
          })
        } else {
          return resolve({
            code: 404,
            status: "not found",
            message: "El usuario no existe"
          });
        }
      }
    });
})


services.getLocation = (data) => {
  return new Promise((resolve, reject) => {
    technicalSchema.findById(data).exec((error, res) => {
      if (error) {
        const fail = {
          ok: false,
          code: 400,
          error
        };
        reject(fail);
      } else {
        locationsSchema.findById(res.address).exec((err, locations) => {
          if (err) {
            const erro = {
              ok: false,
              code: 400,
              err
            };
            reject(erro);
          } else {
            const ok = {
              ok: true,
              code: 200,
              res,
              locations
            };
            resolve(ok);
          }
        });
      }
    });
  });
}






module.exports = services