'use strict'

const moment = require('../../../settings/utils/shared/libs/libs')

const serviceCli = require('../services.model').services
const serviceWeb = require('../services.model').servicesWeb
const Postpone = require('../services.model').Postpone
const technical = require('../../users/technical/technical.model').userTecnicos
const locationsSchema = require('../../users/technical/technical.model').locationsSchema
const pushNotificacionsSchema = require('../../users/technical/technical.model').pushNotificacionsSchema

const { changeStatus } = require('./change-setup')
const messaging = require('../../../settings/utils/firebase/messaging/messaging')

const services = {}

services.createServi = body => new Promise((resolve, reject) => {
  let pos = {
    lat: (body.lat === undefined) ? 3.43722 : body.lat,
    lng: (body.lng === undefined) ? -76.5225 : body.lng
  };
  locationsSchema.findOne(pos, (error, locationOne) => {
    if (error) {
      reject(new Error({ code: 400, message: "Error" }))
    } else {
      if (!locationOne) {
        const locali = new location({
          nameLocation: body.nameLocation,
          addressLocation: body.addressLocation,
          lat: body.lat,
          lng: body.lng
        });
        locationsSchema.create(locali, (error, createlo) => {
          if (error) {
            reject(new Error({ message: "Error", code: 400, ok: false }))
          } else {
            technical.findByIdAndUpdate(
              body.id_cliente,
              { $push: { address: createlo._id } },
              { new: true },
              (error, update) => {
                if (error) {
                  reject(new Error({ message: "error" }))
                } else {
                  body = {
                    id_cliente: body.id_cliente,
                    id_categoria: body.id_categoria,
                    observaciones: body.observaciones,
                    status: body.status,
                    changeStatus: (body.changeStatus =
                      changeStatus["1"].name),
                    stateNumServi: (body.stateNumServi =
                      changeStatus["1"].id),
                    id_location: createlo._id
                  }
                  var service = new serviceCli(body);
                  service.fecha_creacion = moment.format('X')
                  service.dia_creacion = moment.format('YYYY-MM-DD')
                  service.mes_creacion = moment.format('YYYY-MM')
                  service.ano_creacion = moment.format('YYYY')
                  service.fecha_creacion_view = moment.format('YYYY-MM-DD HH:mm:ss')
                  serviceCli.create(service, (error, service) => {
                    if (error) {
                      var fail = {
                        ok: false,
                        status: 400,
                        message: "error al crear el servicio",
                        error
                      };
                      reject(fail)
                    } else {
                      var succes = {
                        ok: true,
                        status: 200,
                        service
                      }
                      resolve(succes)
                    }
                  })
                }
                return false
              }
            )
          }
          return false
        })
      } else {
        let pos = {
          lat: body.lat,
          lng: body.lng
        }
        locationsSchema.findOne(pos, (error, lo) => {
          if (error) {
            reject(new Error({ message: "error", code: 400 }))
          } else {
            body = {
              id_cliente: body.id_cliente,
              id_categoria: body.id_categoria,
              status: body.status,
              changeStatus: (body.changeStatus = changeStatus["1"].name),
              stateNumServi: (body.stateNumServi = changeStatus["1"].id),
              id_location: lo._id
            }
            var service = new serviceCli(body);
            serviceCli.create(service, (error, service) => {
              if (error) {
                var fail = {
                  ok: false,
                  status: 400,
                  message: "error al crear el servicio",
                  error
                }
                reject(fail);
              } else {
                var succes = {
                  ok: true,
                  status: 200,
                  service
                };
                resolve(succes)
              }
            })
          }
          return false
        })
      }
    }
    return false
  })
})

services.createServiceWeb = body => new Promise((resolve, reject) => {
  let pos = {
    lat: body.lat,
    lng: body.lng
  }
  locationsSchema.findOne(pos, (error, locationOne) => {
    if (error) {
      reject(new Error({ code: 400, message: "Error" }));
    } else {
      if (!locationOne) {
        const locali = new locationsSchema({
          nameLocation: body.nameLocation,
          addressLocation: body.addressLocation,
          lat: body.lat,
          lng: body.lng
        });
        locationsSchema.create(locali, (error, createlo) => {
          if (error) {
            reject(new Error({ message: "Error", code: 400, ok: false }))
          } else {
            objBody = {
              id_cliente: body.id_cliente,
              id_categoria: body.id_categoria,
              nameLocation: body.nameLocation,
              addressLocation: body.addressLocation,
              observaciones: body.observaciones,
              status: body.status,
              changeStatus: (body.changeStatus = changeStatus["1"].name),
              stateNumServi: (body.stateNumServi = changeStatus["1"].id),
              expediente: body.expediente,
              id_location: createlo._id,
              fecha_servicio: body.fecha_servicio,
              fecha_aplazar_servicio: body.fecha_aplazar_servicio,
              hora_aplazar_servicio: body.hora_aplazar_servicio
            }

            var service = new serviceWeb(objBody);
            service.fecha_creacion = moment.format('X')
            service.dia_creacion = moment.format('YYYY-MM-DD')
            service.mes_creacion = moment.format('YYYY-MM')
            service.ano_creacion = moment.format('YYYY')
            service.fecha_creacion_view = moment.format('YYYY-MM-DD HH:mm:ss')
            if (body.id_tecnico !== undefined) {
              service.id_tecnico = body.id_tecnico;
            }
            serviceWeb.create(service, (error, serviceResp) => {
              if (error) {
                var fail = {
                  ok: false,
                  status: 407,
                  message: "error al crear el servicio",
                  error
                };
                reject(fail);
              } else {
                // Enviar push a los técnicos disponibles
                if (body.id_tecnico !== undefined) {
                  technical
                    .findById(body.id_tecnico)
                    .populate({
                      path: "tokens",
                      model: PushNotifications
                    })
                    .exec((errorFT, succFT) => {
                      if (errorFT) {
                        var fail = {
                          ok: false,
                          status: 402,
                          message: "error al consultar el técnico",
                          error
                        };
                        reject(fail);
                      } else {
                        let tokens = [];
                        let notification = {
                          title: `${succFT.name}, Se ha creado un nuevo servicio WEB`,
                          body: `${succFT.name} ${succFT.lastname} se te asignado un nuevo servicio en ${body.addressLocation}`
                        };
                        let data_body = {
                          type: "notification_servicioweb",
                          id: serviceResp._id
                        };

                        tokens.push(succFT.tokens.firetoken);
                        messaging(notification, data_body, tokens);
                      }
                      return false
                    });
                } else {
                  technical.find({ role: 3, stateConect: true, state: false })
                    .populate({
                      path: "tokens",
                      model: PushNotifications
                    })
                    .exec((errorTec, tecnicos) => {
                      if (tecnicos) {
                        let tokens = [];
                        let notification = {
                          title:
                            "Se ha creado un nuevo servicio WEB, corre a tomarlo",
                          body: `Se ha creado un servicio WEB en ${body.addressLocation}`
                        }
                        let data_body = {
                          type: "notification_servicioweb",
                          id: "SERVICIO_WEB"
                        }
                        tecnicos.map(tec => {
                          tokens.push(tec.tokens.firetoken)
                          return undefined
                        })
                        messaging(notification, data_body, tokens);
                      }
                      return false
                    })
                }
                var succes = {
                  ok: true,
                  status: 200,
                  service
                }
                resolve(succes)
              }
            })
          }
          return false
        })
      } else {
        let pos = {
          lat: body.lat,
          lng: body.lng
        }
        locationsSchema.findOne(pos, (error, lo) => {
          if (error) {
            reject(new Error({ message: "error", code: 400 }))
          } else {
            body = {
              id_cliente: body.id_cliente,
              id_categoria: body.id_categoria,
              status: body.status,
              changeStatus: (body.changeStatus = changeStatus["1"].name),
              stateNumServi: (body.stateNumServi = changeStatus["1"].id),
              id_location: lo._id
            }
            var service = new serviceWeb(body);
            service.fecha_creacion = currentDate;
            service.fecha_creacion_view = currentDateView;
            service.dia_creacion = currentDay;
            service.mes_creacion = currentMonth;
            service.ano_creacion = currentYear;
            service.id_location = lo._id;
            if (body.id_tecnico !== undefined) {
              service.id_tecnico = body.id_tecnico;
            }
            serviceWeb.create(service, (error, serviceResp) => {
              if (error) {
                var fail = {
                  ok: false,
                  status: 400,
                  message: "error al crear el servicio web",
                  error
                };
                reject(fail);
              } else {
                var succes = {
                  ok: true,
                  status: 200,
                  serviceResp
                };
                resolve(succes)
              }
            })
          }
          return false
        })
      }
    }
    return false
  })
})

services.getService = data => new Promise((resolve, reject) => {
  technical.findById(data, (error, userTecnico) => {
    if (userTecnico) {
      if (userTecnico.stateConect) {
        serviceCli
          .find({ stateNumServi: 1, postPoned: false })
          .populate({ path: "id_cliente" })
          .populate({ path: "id_categoria" })
          .populate({ path: "id_tecnico" })
          .populate({ path: "id_location" })
          .exec((err, servi) => {
            if (err) {
              reject(err);
            } else {
              resolve({ servi, userTecnico })
            }
          })
      } else {
        const disconec = {
          ok: false,
          status: 400,
          message: "Debe estar conectado para ver los servicio"
        };
        reject(disconec)
      }
    } else {
      const not = {
        ok: false,
        status: 400,
        message: "No existe el usuario",
        error
      };
      reject(not)
    }
    return false
  })
})

services.getServiceWeb = data => new Promise((resolve, reject) => {
  technical.findById(data, (error, userTecnico) => {
    if (userTecnico) {
      if (userTecnico.stateConect) {
        serviceWeb
          .find({ stateNumServi: 1, postPoned: false })
          .populate({ path: "id_cliente" })
          .populate({ path: "id_categoria" })
          .populate({ path: "id_tecnico" })
          .populate({ path: "id_location" })
          .exec((err, servi) => {
            if (err) {
              reject(err)
            } else {
              resolve({ servi, userTecnico })
            }
          });
      } else {
        const disconec = {
          ok: false,
          status: 400,
          message: "Debe estar conectado para ver los servicio"
        };
        reject(disconec)
      }
    } else {
      const not = {
        ok: false,
        status: 400,
        message: "No existe el usuario",
        error
      };
      reject(not)
    }
    return false
  })
  return false
})


services.tecnicoIncribeService = (params, data) => new Promise((resolve, reject) => {
  serviceCli.findById({ _id: params.serviceid }, (erro, servic) => {
    if (erro) {
      const fail = {
        ok: false,
        message: "hubo un error",
        status: 400
      };
      reject(fail);
    } else {
      data.changeStatus = changeStatus["4"].name;
      data.stateNumServi = changeStatus["4"].id;
      serviceCli.findByIdAndUpdate({ _id: params.serviceid }, data, { new: true }, (err, succe) => {
        if (err) {
          const er = {
            ok: false,
            message: "Error"
          };
          reject(er)
        } else {
          resolve(succe)
        }
      })
    }
    return false
  })
})

services.tecnicoIncribeServiceWeb = (params, data) => new Promise((resolve, reject) => {
  serviceWeb.findById({ _id: params.serviceid }, (erro, servic) => {
    if (erro) {
      const fail = {
        ok: false,
        message: "hubo un error",
        status: 400
      };
      reject(fail);
    } else {
      data.changeStatus = changeStatus["4"].name;
      data.stateNumServi = changeStatus["4"].id;
      serviceWeb.findByIdAndUpdate({ _id: params.serviceid }, data, { new: true }, (err, succe) => {
        if (err) {
          const er = {
            ok: false,
            message: "Error"
          };
          reject(er)
        } else {
          resolve(succe)
        }
      }
      )
    }
    return false
  })
})

services.getServicePrice = id => new Promise((resolve, reject) => {
  serviceCli.findById(id, (error, price) => {
    if (error) {
      const fail = {
        ok: false,
        status: 400,
        message: "error al traer el servicio",
        error
      };

      reject(fail)
    } else {
      const succes = {
        ok: true,
        status: 200,
        price
      };

      resolve(succes)
    }
  })
})


services.getPriceWeb = id => new Promise((resolve, reject) => {
  serviceWeb.findById(id, (error, price) => {
    if (error) {
      const fail = {
        ok: false,
        status: 400,
        message: "error al traer el servicio",
        error
      }
      reject(fail)
    } else {
      const succes = {
        ok: true,
        status: 200,
        price
      }
      resolve(succes)
    }
  })
})

services.updatestate = (id, data) => new Promise((resolve, reject) => {
  serviceCli.findByIdAndUpdate(id, data, { new: true }, (
    error,
    succe
  ) => {
    if (error) {
      const fail = {
        ok: false,
        message: "error al cambiar de estado",
        status: 400,
        error
      };
      reject(fail);
    } else {
      const id = succe.id_tecnico;
      const body = {
        status: data.status
      };
      technical.findByIdAndUpdate(id, body, { new: true }, (error, exito) => {
        if (error) {
          const fail = {
            ok: false,
            status: 400,
            message: "error con el estado de tecnico",
            error
          }
          reject(fail)
        } else {
          const ok = {
            ok: true,
            status: 200,
            succe,
            exito
          };
          resolve(ok)
        }
      })
    }
    return false
  })
})

services.updateStateWeb = (id, data) => new Promise((resolve, reject) => {
  serviceWeb.findByIdAndUpdate(id, data, { new: true }, (
    error,
    succe
  ) => {
    if (error) {
      const fail = {
        ok: false,
        message: "error al cambiar de estado",
        status: 400,
        error
      };
      reject(fail);
    } else {
      const id = succe.id_tecnico;
      const body = {
        status: data.status
      };
      technical.findByIdAndUpdate(id, body, { new: true }, (error, exito) => {
        if (error) {
          const fail = {
            ok: false,
            status: 400,
            message: "error con el estado de tecnico",
            error
          }
          reject(fail)
        } else {
          const ok = {
            ok: true,
            status: 200,
            succe,
            exito
          }
          resolve(ok)
        }
      })
    }
    return false
  })
})

services.updateTomadoWeb = (id, data) => new Promise((resolve, reject) => {
  serviceWeb.findByIdAndUpdate(id, data, { new: true }, (
    error,
    succe
  ) => {
    if (error) {
      const fail = {
        ok: false,
        message: "error al cambiar de estado",
        status: 400,
        error
      };
      reject(fail);
    } else {
      const id = succe.id_tecnico;
      const body = {
        status: data.status
      };
      technical.findByIdAndUpdate(id, body, { new: true }, (error, exito) => {
        if (error) {
          const fail = {
            ok: false,
            status: 400,
            message: "error con el estado de tecnico",
            error
          }
          reject(fail)
        } else {
          const ok = {
            ok: true,
            status: 200,
            succe,
            exito
          }
          resolve(ok)
        }
      })
    }
    return false
  })
})

services.getmyservice = (id_tecnico) => new Promise((resolve, reject) => {
  technical.findById(id_tecnico, (error, tecnico) => {
    if (tecnico) {
      serviceCli
        .find({ id_tecnico: tecnico._id })
        .populate({ path: "id_tecnico" })
        .populate({ path: "id_cliente" })
        .populate({ path: "id_categoria" })
        .populate({ path: "id_location" })
        .populate({ path: "id_postponed" })
        .exec((error, succes) => {
          if (error) {
            const fail = {
              ok: false,
              status: 400,
              message: "Error al cargar mis servicios",
              error
            }
            reject(fail);
          } else {
            resolve({
              ok: true,
              status: 200,
              succes
            })
          }
        })
    } else {
      const fail = {
        ok: false,
        status: 400,
        message: "El tecnico no existe",
        error
      }
      reject(fail)
    }
    return false
  })
})

services.getMyserviceWeb = (id_tecnico) => new Promise((resolve, reject) => {
  technical.findById(id_tecnico, (error, tecnico) => {
    if (tecnico) {
      serviceWeb
        .find({ id_tecnico: tecnico._id })
        .populate({ path: "id_tecnico" })
        .populate({ path: "id_cliente" })
        .populate({ path: "id_categoria" })
        .populate({ path: "id_location" })
        .populate({ path: "id_postponed" })
        .exec((error, succes) => {
          if (error) {
            const fail = {
              ok: false,
              status: 400,
              message: "Error al cargar mis servicios",
              error
            }
            reject(fail);
          } else {
            resolve({
              ok: true,
              status: 200,
              succes
            })
          }
        })
    } else {
      const fail = {
        ok: false,
        status: 400,
        message: "El tecnico no existe",
        error
      }
      reject(fail)
    }
    return false
  })
})


services.getServicesA = id => new Promise((resolve, reject) => {
  technical.findById(id).exec((err, resTe) => {
    if (err) {
      const fail = {
        ok: false,
        status: 400,
        message: "Error al cargar mis servicios",
        err
      };
      reject(fail);
    } else {
      if (resTe) {
        Postpone.findOne({ id_tecnico: resTe._id }).exec((err, succes) => {
          if (err) {
            const fail = {
              ok: false,
              status: 400,
              message: "Error al cargar mis servicios",
              err
            }
            reject(fail)
          } else {
            resolve({
              ok: true,
              status: 200,
              succes
            })
          }
        })
      } else {
        const fail = {
          ok: false,
          status: 400,
          message: "El tecnico no existe",
          err
        };
        resolve(fail)
      }
    }
    return false
  })
})

services.updateStateTecnico = (id, data) => new Promise((resolve, reject) => {
  serviceCli.findById({ _id: id }, (error, succe) => {
    if (error) {
      const fail = {
        ok: false,
        message: "error al cambiar de estado",
        status: 400,
        error
      };
      reject(fail);
    } else {
      const id = succe.id_tecnico;
      technical.findByIdAndUpdate(id, data, { new: true }, (error, exito) => {
        if (error) {
          const fail = {
            ok: false,
            status: 400,
            message: "error con el estado de tecnico",
            error
          }
          reject(fail)
        } else {
          const ok = {
            ok: true,
            status: 200,
            succe,
            exito
          }
          resolve(ok)
        }
      })
    }
    return false
  })
})

services.updateStateTecnicoWeb = (id, data) => new Promise((resolve, reject) => {
  serviceWeb.findById({ _id: id }, (error, succe) => {
    if (error) {
      const fail = {
        ok: false,
        message: "error al cambiar de estado",
        status: 400,
        error
      }
      reject(fail);
    } else {
      const id = succe.id_tecnico;
      technical.findByIdAndUpdate(id, data, { new: true }, (error, exito) => {
        if (error) {
          const fail = {
            ok: false,
            status: 400,
            message: "error con el estado de tecnico",
            error
          }
          reject(fail)
        } else {
          const ok = {
            ok: true,
            status: 200,
            succe,
            exito
          }
          resolve(ok)
        }
      })
    }
    return false
  })
})

services.MyserviceCliente = (id) => new Promise((resolve, reject) => {
  const idCli = {
    id_cliente: id
  }
  serviceCli
    .find(idCli)
    .populate({ path: "id_tecnico" })
    .populate({ path: "id_categoria" })
    .exec((error, succes) => {
      if (error) {
        const fail = {
          ok: false,
          code: 400,
          message: "error"
        }
        reject(fail)
      } else {
        resolve(succes)
      }
      return false
    })
})

services.MyserviceClienteWeb = (id) => new Promise((resolve, reject) => {
  const idCli = {
    id_cliente: id
  }

  serviceWeb
    .find(idCli)
    .populate({ path: "id_tecnico" })
    .populate({ path: "id_categoria" })
    .exec((error, succes) => {
      if (error) {
        const fail = {
          ok: false,
          code: 400,
          message: "error"
        };
        reject(fail)
      } else {
        resolve(succes)
      }
      return false
    })
})

services.cancelService = (id_service, body) => new Promise((resolve, reject) => {
  serviceCli.findByIdAndUpdate({ _id: id_service }, { $unset: { id_tecnico: "" } }, { new: true }, (error, remove) => {
    if (error) {
      const fail = {
        ok: false,
        message: "error al borrar el campo",
        code: 400,
        error
      };
      reject(fail);
    } else {
      serviceCli.findByIdAndUpdate({ _id: id_service }, body, { new: true }, (erro, update) => {
        if (erro) {
          const fai = {
            ok: false,
            message: "error",
            code: 400,
            erro
          }
          reject(fai)
        } else {
          const exi = {
            ok: true,
            code: 200,
            update,
            remove
          }
          resolve(exi)
        }
        return false
      }
      )
    }
    return false
  }
  )
})


services.CancelServiceTecnicoWeb = (id_service, body) => new Promise((resolve, reject) => {
  serviceWeb.findByIdAndUpdate({ _id: id_service }, { $unset: { id_tecnico: "" } }, { new: true }, (error, remove) => {
    if (error) {
      const fail = {
        ok: false,
        message: "error al borrar el campo",
        code: 400,
        error
      };
      reject(fail);
    } else {
      serviceCli.findByIdAndUpdate({ _id: id_service }, body, { new: true }, (erro, update) => {
        if (erro) {
          const fai = {
            ok: false,
            message: "error",
            code: 400,
            erro
          }
          reject(fai)
        } else {
          const exi = {
            ok: true,
            code: 200,
            update,
            remove
          }
          resolve(exi)
        }
        return false
      }
      )
    }
    return false
  }
  )
})

services.updateUrlPhotos = (data, id, id_service) => new Promise((resolve, reject) => {
  technical.findById(id, (error, enableTecnico) => {
    if (error) {
      const fail = {
        ok: false,
        code: 400,
        message: "Tecnico no existe",
        error
      };
      reject(fail);
    } else {
      serviceCli.findByIdAndUpdate(id_service, { $push: { url_img: data } }, { new: true }, (error, updateUrl) => {
        if (error) {
          const err = {
            ok: false,
            code: 400,
            message: "Error al actualizar la url",
            error
          }
          reject(err)
        } else {
          const succe = {
            ok: true,
            code: 200,
            updateUrl
          }
          resolve(succe)
        }
        return false
      }
      )
    }
    return false
  })
})


services.UpdateUrlWebPhoto = (data, id, id_service) => new Promise((resolve, reject) => {
  technical.findById(id, (error, enableTecnico) => {
    if (error) {
      const fail = {
        ok: false,
        code: 400,
        message: "Tecnico no existe",
        error
      };
      reject(fail);
    } else {
      serviceWeb.findByIdAndUpdate(id_service, { $push: { url_img: data } }, { new: true }, (error, updateUrl) => {
        if (error) {
          const err = {
            ok: false,
            code: 400,
            message: "Error al actualizar la url",
            error
          }
          reject(err)
        } else {
          const succe = {
            ok: true,
            code: 200,
            updateUrl
          }
          resolve(succe)
        }
        return false
      }
      )
    }
    return false
  })
})

services.updateUrlPhotosFin = (data, id, id_service) => new Promise((resolve, reject) => {
  technical.findById(id, (error, enableTecnico) => {
    if (error) {
      const fail = {
        ok: false,
        code: 400,
        message: "Tecnico no existe",
        error
      };
      reject(fail);
    } else {
      serviceCli.findByIdAndUpdate(id_service, { $push: data }, { new: true }, (error, updateUrl) => {
        if (error) {
          const err = {
            ok: false,
            code: 400,
            message: "Error al actualizar la url",
            error
          }
          reject(err);
        } else {
          const succe = {
            ok: true,
            code: 200,
            updateUrl
          }
          resolve(succe)
        }
        return false
      }
      )
    }
    return false
  })
})

services.UpdateUrlWebPhotoFin = (data, id, id_service) => new Promise((resolve, reject) => {
  technical.findById(id, (error, enableTecnico) => {
    if (error) {
      const fail = {
        ok: false,
        code: 400,
        message: "Tecnico no existe",
        error
      };
      reject(fail);
    } else {
      serviceWeb.findByIdAndUpdate(id_service, { $push: data }, { new: true }, (error, updateUrl) => {
        if (error) {
          const err = {
            ok: false,
            code: 400,
            message: "Error al actualizar la url",
            error
          }
          reject(err)
        } else {
          const succe = {
            ok: true,
            code: 200,
            updateUrl
          }
          resolve(succe)
        }
        return false
      }
      )
    }
    return false
  })
})


services.cancelServicesClient = (id_client, id_services, body) => new Promise((resolve, reject) => {
  tecnico.findById(id_client, (err, find) => {
    if (err) {
      reject(new Error({
        code: 500,
        message: "Problemas con el servidor",
        ok: false,
        err
      }))
    } else {
      if (find) {
        serviceCli.findByIdAndUpdate(id_services, body, { new: true }, (erro, update) => {
          if (erro) {
            reject(new Error({
              code: 500,
              message: "Hubo problemas al actualizar",
              ok: false,
              erro
            }))
          } else {
            resolve({
              code: 200,
              message: "Se actualizo correctamente",
              ok: true,
              update
            })
          }
          return false
        }
        )
      } else {
        reject(new Error({
          code: 500,
          message: "El Cliente no exite",
          ok: false,
          err
        }))
      }
    }
    return false
  })
})

services.asignacionTecnico = (body, params) => new Promise((resolve, reject) => {
  serviceCli.findByIdAndUpdate({ _id: params.id }, body, { new: true }, (error, updateTecnico) => {
    if (error) {
      const fail = {
        ok: false,
        code: 400,
        message: "Error al asignar el tecnico",
        error
      }
      reject(fail)
    } else {
      const succe = {
        ok: true,
        code: 200,
        updateTecnico
      };
      resolve(succe)
    }
    return false
  }
  )
})

services.asignacionTecnicoWeb = (body, params) => new Promise((resolve, reject) => {
  serviceWeb.findByIdAndUpdate({ _id: params.id }, { id_tecnico: body.id_tecnico }, { new: true }, (error, updateTecnico) => {
    if (error) {
      const fail = {
        ok: false,
        code: 400,
        message: "Error al asignar el tecnico",
        error
      };
      reject(fail);
    } else {
      technical
        .findById(body.id_tecnico)
        .populate({
          path: "tokens",
          model: PushNotifications
        })
        .exec((errorFT, succFT) => {
          let tokens = [];
          let notification = {
            title: `${succFT.name}, se te reasignado un nuevo servicio`,
            body: `${succFT.name} ${succFT.lastname} se te reasignado un nuevo servicio `
          };
          let data_body = {
            type: "notification_reasigservicioweb",
            id: updateTecnico._id
          };

          tokens.push(succFT.tokens.firetoken);
          messaging(notification, data_body, tokens);
        })
      const succe = {
        ok: true,
        code: 200,
        updateTecnico
      }
      resolve(succe)
    }
    return false
  }
  )
})


services.aplazarServicioWeb = (id, data) => new Promise((resolve, reject) => {
  serviceWeb.findByIdAndUpdate(id, data, { new: true }, (error, succe) => {
    if (error) {
      const fail = {
        ok: false,
        status: 400,
        message: "error al aplazar el servicio",
        error
      }
      return reject(fail)
    } else {
      const succes = {
        ok: true,
        status: 200,
        succe
      }
      return resolve(succes)
    }
  })
})

services.getServiceImage = () => new Promise((resolve, reject) => {
  serviceCli
    .find()
    .populate({ path: "id_cliente" })
    .populate({ path: "id_categoria" })
    .populate({ path: "id_tecnico" })
    .populate({ path: "id_location" })
    .exec((err, servi) => {
      if (err) {
        reject(new Erroro(err))
      } else {
        if (servi) {
          resolve(servi);
        } else {
          reject(new Error({ message: "el servicio no existe", code: 404 }))
        }
      }
      return false
    })
})

services.getServicesWeb = () => new Promise((resolve, reject) => {
  serviceWeb
    .find()
    .populate({ path: "id_cliente" })
    .populate({ path: "id_categoria" })
    .populate({ path: "id_tecnico" })
    .populate({ path: "id_location" })
    .exec((err, servi) => {
      if (err) {
        reject(err);
      } else {
        if (servi) {
          resolve(servi);
        } else {
          reject(new Error({ message: "el servicio no existe", code: 404 }))
        }
      }
      return false
    })
})

services.updateprice = (id, data) => new Promise((resolve, reject) => {
  serviceCli.findByIdAndUpdate(id, data, { new: true }, (error, succe) => {
    if (error) {
      const fail = {
        ok: false,
        status: 400,
        message: "error al enviar el precio total",
        error
      }
      return reject(fail)
    } else {
      const succes = {
        ok: true,
        status: 200,
        succe
      }
      return resolve(succes)
    }
  })
})

services.update_price_web = (id, data) => new Promise((resolve, reject) => {
  serviceWeb.findByIdAndUpdate(id, data, { new: true }, (error, succe) => {
    if (error) {
      const fail = {
        ok: false,
        status: 400,
        message: "error al enviar el precio total",
        error
      };
      reject(fail)
    } else {
      const succes = {
        ok: true,
        status: 200,
        succe
      }
      resolve(succes)
    }
    return false
  })
})

services.getAllServices = () => new Promise((resolve, reject) => {
  serviceCli
    .find()
    .populate({ path: "id_tecnico" })
    .populate({ path: "id_categoria" })
    .exec((error, succes) => {
      if (error) {
        const fail = {
          ok: false,
          code: 400,
          message: "error"
        };
        reject(fail);
      } else {
        resolve(succes);
      }
      return false
    })
})

services.getAllServicesWeb = () => new Promise((resolve, reject) => {
  serviceWeb
    .find()
    .populate({ path: "id_tecnico" })
    .populate({ path: "id_categoria" })
    .exec((error, succes) => {
      if (error) {
        const fail = {
          ok: false,
          code: 400,
          message: "error"
        };
        reject(fail)
      } else {
        resolve(succes)
      }
    })
})


services.getServicesWebByID = (id) => new Promise((resolve, reject) => {
  serviceWeb
    .findById(id)
    .populate({ path: "id_cliente" })
    .populate({ path: "id_categoria" })
    .populate({ path: "id_tecnico" })
    .populate({ path: "id_location" })
    .exec((err, servi) => {
      if (err) {
        reject(err);
      } else {
        if (servi) {
          resolve(servi);
        } else {
          reject(new Error({ message: "el servicio no existe", code: 404 }))
        }
      }
      return false
    })
})


services.getServiceByID = (id) => new Promise((resolve, reject) => {
  serviceCli
    .findById(id)
    .populate({ path: "id_cliente" })
    .populate({ path: "id_categoria" })
    .populate({ path: "id_tecnico" })
    .populate({ path: "id_location" })
    .exec((err, servi) => {
      if (err) {
        reject(err);
      } else {
        if (servi) {
          resolve(servi);
        } else {
          reject(new Error({ message: "el servicio no existe", code: 404 }))
        }
      }
      return false
    })
})

services.addListA = data => new Promise((resolve, reject) => {
  tecnico.findById(data["id_user"]).exec((e, respon) => {
    if (e) {
      reject(new Error({ code: 500, status: "Internal error server", e }))
    } else {
      if (respon) {
        PostPone.findOne({ id_service: data["idservices"] }).exec(
          (err, findPos) => {
            if (err) {
              reject(new Error({
                code: 500,
                status: "Internal error serve",
                err
              }))
            } else {
              PostPone.findByIdAndUpdate(
                findPos["_id"],
                { flagA: true },
                { new: true }
              ).exec((err, updateOk) => {
                if (err) {
                  reject(new Error({
                    code: 500,
                    status: "Internal error serve",
                    err
                  }))
                } else {
                  resolve({
                    code: 200,
                    status: "OK",
                    message: "aplazado ",
                    updateOk
                  })
                }
                return false
              })
            }
            return false
          }
        );
      } else {
        resolve({
          code: 404,
          status: "Not found",
          message: "el usuario no existe"
        })
      }
    }
    return false
  })
})

services.getListA = data => new Promise((resolve, reject) => {
  technical.findById(data["id"], (error, userTecnico) => {
    if (error) {
      return reject(new Error({ code: 500, message: "error internal server", error }))
    } else {
      if (userTecnico) {
        
        if (userTecnico["role"] === 3) {
          if (userTecnico["stateConect"]) {
            serviceCli
              .find({})
              .populate({ path: "id_cliente" })
              .populate({ path: "id_categoria" })
              .populate({ path: "id_tecnico" })
              .populate({ path: "id_location" })
              .populate({ path: "id_postponed" })
              .exec((err, servi) => {
                if (err) {
                  reject(new Error({
                    code: 500,
                    message: "error internal serve",
                    err
                  }))
                } else {
                  resolve({
                    code: 200,
                    status: "OK",
                    servi,
                    userTecnico
                  })
                }
                return false
              })
          } else {
            const disconec = {
              ok: false,
              code: 400,
              message: "Debe estar conectado para ver los servicio"
            };
            resolve(disconec)
          }
        }
      } else {
        const not = {
          ok: false,
          code: 404,
          message: "No existe el usuario"
        };
        resolve(not)
      }
    }
    return false
  })
})



module.exports = services


