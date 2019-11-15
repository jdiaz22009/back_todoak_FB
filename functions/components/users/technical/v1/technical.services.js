'use strict'
const moment = require('../../../../settings/utils/shared/libs/libs')
const bcrypt = require('bcrypt')

const TechnicalSchema = require('../technical.model').userTecnicos
const LocationsSchema = require('../technical.model').locationsSchema
const RRHSchema = require('../technical.model').StateRRHH
const PushNotificationsSchema = require('../technical.model').pushNotificacionsSchema

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

  const technicalS = new TechnicalSchema(data)

  TechnicalSchema.findOne({ email: data['email'] }).exec((err, userFind) => {
    if (err) {
      return reject(new Error({
        code: 500,
        status: 'Error server internal',
        err,
        ok: false
      }))
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
        TechnicalSchema.create(technicalS, (err, createUser) => {
          if (err) {
            return reject(new Error({
              code: 500,
              status: 'Error server internal',
              err,
              ok: false
            }))
          } else {
            const token = new PushNotificationsSchema({
              firetoken: data['firetoken'],
              platform: data['platform'],
              usertype: data['role'],
              uuid: data['uuid']
            });
            PushNotificationsSchema.findOne({ uuid: data['uuid'] }).exec(
              (err, pushNoti) => {
                if (err) {
                  return reject(new Error({
                    code: 500,
                    status: 'Error server internal',
                    err,
                    ok: false
                  }))
                } else {
                  if (pushNoti) {
                    PushNotificationsSchema.findByIdAndUpdate(
                      pushNoti['_id'],
                      { firetoken: data['firetoken'] },
                      { new: true },
                      (err, updatePush) => {
                        if (err) {
                          return reject(new Error({
                            code: 500,
                            status: 'Error server internal',
                            err,
                            ok: false
                          }))
                        } else {
                          TechnicalSchema.findByIdAndUpdate(
                            createUser['_id'],
                            { tokens: updatePush['_id'] },
                            { new: true },
                            (err, userUpdate) => {
                              if (err) {
                                return reject(new Error({
                                  code: 500,
                                  status: 'Error server internal',
                                  err,
                                  ok: false
                                }))
                              } else {
                                console.log("push token", userUpdate);
                              }
                              return false
                            })
                        }
                        return false
                      })
                  } else {
                    PushNotificationsSchema.create(token, (err, createToken) => {
                      if (err) {
                        return reject(new Error({
                          code: 500,
                          status: 'Error server internal',
                          err,
                          ok: false
                        }))
                      } else {
                        TechnicalSchema.findByIdAndUpdate(
                          createUser['_id'],
                          { tokens: createToken['_id'] },
                          { new: true },
                          (err, userUpdate) => {
                            if (err) {
                              return reject(new Error({
                                code: 500,
                                status: 'Error server internal',
                                err,
                                ok: false
                              }))
                            } else {
                              console.log("push token", userUpdate);
                            }
                            return false
                          })
                      }
                      return false
                    })
                  }
                }
                return false
              })
            if (data['role'] === 2) {
              var location = new LocationsSchema({
                nameLocation: data['nameLocation'],
                addressLocation: data['addressLocation'],
                lat: data['lat'],
                lng: data['lng']
              })
              LocationsSchema.create(location, (err, createLocation) => {
                if (err) {
                  return reject(new Error({
                    message: "Error, por favor espere",
                    code: 504,
                    ok: false
                  }))
                } else {
                  TechnicalSchema.findByIdAndUpdate(
                    createUser['_id'],
                    { $push: { address: createLocation['_id'] } },
                    { new: true }).exec((error, update) => {
                      if (error) {
                        return reject(new Error({
                          message: 'Error de actualizacion',
                          code: 504,
                          ok: false
                        }))
                      } else {
                        console.log(
                          "Registro exitoso",
                          JSON.stringify(update)
                        );
                      }
                      return false
                    })
                }
                return false
              })
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
    return false
  });
})

services.loginTechnical = data => new Promise((resolve, reject) => {
  TechnicalSchema.findOne({ email: data['email'] })
    .populate({ path: 'estado_rrhh', model: RRHSchema })
    .exec((err, findUser) => {
      if (err) {
        reject(new Error({
          code: 500,
          status: 'Internal server error',
          error
        }))
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
            const token = new PushNotificationsSchema({
              firetoken: data['firetoken'],
              platform: data['platform'],
              usertype: data['role'],
              uuid: data['uuid']
            });
            PushNotificationsSchema.findOne({ uuid: data['uuid'] }).exec(
              (err, pushNoti) => {
                if (err) {
                  reject(new Error({
                    code: 500,
                    status: 'Error server internal',
                    err,
                    ok: false
                  }))
                } else {
                  if (pushNoti) {
                    PushNotificationsSchema.findByIdAndUpdate(
                      pushNoti['_id'],
                      { firetoken: data['firetoken'] },
                      { new: true },
                      (err, updatePush) => {
                        if (err) {
                          reject(new Error({
                            code: 500,
                            status: "Error server internal",
                            err,
                            ok: false
                          }))
                        } else {
                          TechnicalSchema.findByIdAndUpdate(
                            findUser['_id'],
                            { tokens: updatePush['_id'] },
                            { new: true },
                            (err, userUpdate) => {
                              if (err) {
                                return reject(new Error({
                                  code: 500,
                                  status: 'Error server internal',
                                  err,
                                  ok: false
                                }))
                              } else {
                                console.log(JSON.stringify(userUpdate));
                              }
                              return false
                            })
                        }
                      }
                    );
                  } else {
                    PushNotificationsSchema.create(token, (err, createToken) => {
                      if (err) {
                        reject(new Error({
                          code: 500,
                          status: 'Error server internal',
                          err,
                          ok: false
                        }))
                      } else {
                        TechnicalSchema.findByIdAndUpdate(
                          createUser['_id'],
                          { tokens: createToken['_id'] },
                          { new: true },
                          (err, userUpdate) => {
                            if (err) {
                              reject(new Error({
                                code: 500,
                                status: 'Error server internal',
                                err,
                                ok: false
                              }))
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
      return false
    });
})


services.getLocation = (data) => {
  return new Promise((resolve, reject) => {
    TechnicalSchema.findById(data).exec((error, res) => {
      if (error) {
        const fail = {
          ok: false,
          code: 400,
          error
        };
        reject(fail);
      } else {
        LocationsSchema.findById(res.address).exec((err, locations) => {
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


services.changeStatus = (id_tecnico, data) => new Promise((resolve, reject) => {
  TechnicalSchema.findById({ _id: id_tecnico }).exec((error, userTec) => {
    if (userTec) {
      TechnicalSchema.findByIdAndUpdate(userTec._id, data, { new: true }).exec((error, tecnico) => {
        if (error) {
          const fail = {
            ok: false,
            status: 400,
            message: "Error en el estado del tecnico",
            error
          };
          reject(fail)
        } else {
          const succes = {
            ok: true,
            status: 200,
            userTec
          };
          resolve(succes)
        }
      });
    } else {
      const err = {
        ok: false,
        status: 400,
        message: "Error el usuario no se ha encontrado o no existe",
        error
      };
      reject(err)
    }
  })
})

services.technicalAvailable = params => new Promise((resolve, reject) => {
  TechnicalSchema.find(params).exec((error, tecnico) => {
    if (error) {
      const fail = {
        ok: false,
        message: "Error al traer el tecnico",
        code: 400
      };
      reject(fail)
    } else {
      const succe = {
        ok: true,
        code: 200,
        tecnico
      }
      resolve(succe)
    }
  })
})


services.getAllUser = () => new Promise((resolve, reject) => {
  TechnicalSchema.find({}).exec((err, result) => {
    if (err) {
      const error = {
        ok: false,
        status: 500,
        err
      };
      reject(error)
    } else {
      resolve({ db: result, ok: true })
    }
  })
})

services.getAllUserClient = () => new Promise((resolve, reject) => {
  TechnicalSchema.find({ role: 3 }).exec((err, result) => {
    if (err) {
      const error = {
        ok: false,
        status: 500,
        err
      };
      reject(error)
    } else {
      resolve({ db: result, ok: true })
    }
  })
})


services.getAllTechnical = () => new Promise((resolve, reject) => {
  TechnicalSchema.find({ role: 3 })
    .populate({ path: 'estado_rrhh' })
    .exec((err, result) => {
      if (err) {
        const error = {
          ok: false,
          status: 500,
          err
        }
        reject(error)
      } else {
        resolve({ db: result, ok: true })
      }
    })
})

services.getAllTechnicalFree = () => new Promise((resolve, reject) => {
  TechnicalSchema.find({ role: 3, stateConect: true, state: false })
    .populate({ path: 'estado_rrhh' })
    .exec((err, result) => {
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

services.getAllTecnicosNew = () => new Promise((resolve, reject) => {
  TechnicalSchema.find({ role: 3, worker: false }).exec((err, result) => {
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

services.aceptarTecnico = id => new Promise((resolve, reject) => {
  const data = { worker: true };
  TechnicalSchema.findByIdAndUpdate(id, data, { new: true })
    .populate({ path: 'estado_rrhh' })
    .exec((err, success) => {
      if (err) {
        const error = {
          ok: false,
          status: 500,
          err
        };
        reject(error)
      } else {
        resolve({ db: success, ok: true })
      }
      return false
    })
})

services.newRRHH = body => new Promise((resolve, reject) => {
  const state = new RRHSchema({
    name: body.nombre,
    description: body.descripcion,
    sequence: body.secuencia
  });

  RRHSchema.findOne({ secuencia: body.secuencia }).exec((error, objRRHH) => {
    if (error) {
      reject(error);
    } else {
      if (objRRHH) {
        const errornew = {
          ok: false,
          status: 400,
          error: {
            message: "El estado ya existe"
          }
        }
        resolve(errornew);
      } else {
        RRHSchema.create(state, (err, newRRHH) => {
          if (err) {
            reject(err);
          } else {
            resolve({ db: newRRHH, ok: true });
          }
        })
      }
    }
  })
})


services.getRRHH = id => new Promise((resolve, reject) => {
  RRHSchema.findById(id).exec((error, objRRHH) => {
    if (error) {
      reject(error);
    } else {
      resolve({ db: objRRHH, ok: true });
    }
  })
})


services.getAllRRHH = () =>
  new Promise((resolve, reject) => {
    RRHSchema.find({}).exec((error, objRRHH) => {
      if (error) {
        reject(error);
      } else {
        resolve({ db: objRRHH, ok: true })
      }
    })
  })




services.createAdmin = token => new Promise((resolve, reject) => {
  let jsonAdmin = {
    email: "admin@todoak.com",
    isadmin: true,
    name: "admin",
    lastname: "name"
  };
  const users = new TechnicalSchema(jsonAdmin);
  TechnicalSchema.findOne({ email: jsonAdmin.email }).exec((err, succes) => {
    if (err) {
      return reject(new Error({
        code: 500,
        status: "Error server internal",
        err,
        ok: false
      }))
    } else {
      if (succes) {
        return resolve({
          code: 200,
          status: "OK",
          message: "User already exists",
          ok: true
        });
      } else {
        users.password = bcrypt.hashSync("qwerty", 10);
        TechnicalSchema.create(users, (err, userCreate) => {
          if (err) {
            return reject(new Error({
              code: 500,
              status: "Error server internal",
              err,
              ok: false
            }))
          } else {
            return resolve({
              code: 200,
              status: "OK",
              message: "Admin created",
              ok: true
            })
          }
        })
      }
    }
    return false
  })
})

services.loginAdmin = data => new Promise((resolve, reject) => {
  TechnicalSchema.findOne({ email: data["email"] }).exec((error, findUser) => {
    if (err) {
      return reject(new Error({
        code: 500,
        status: "Error server internal",
        err,
        ok: false
      }))
    } else {
      return resolve({
        code: 200,
        status: "OK",
        message: `Admin login: ${findUser}`,
        ok: true
      })
    }
  })
})















services.sendNotificationPush = (role, data) => new Promise((resolve, reject) => {
  if (role === '3') {
    technicalSchema.find({ role }).populate({ path: "tokens", model: pushNotificationsSchema }).exec((err, docs) => {
      if (err) {
        reject(err)
      } else {
        let tokens = []
        docs.map(user => {
          if (user["role"] === 3) {
            tokens.push(user["tokens"]["firetoken"]);
          }
          return undefined
        })
        let notification = {
          title: data.titulo,
          body: data.cuerpo
        };
        let payload = {
          type: "notification_reasigservicioweb",
          id: "notification_reasigservicioweb"
        };
        resolve({ notification, payload, tokens })
      }
    })
  }
})



module.exports = services