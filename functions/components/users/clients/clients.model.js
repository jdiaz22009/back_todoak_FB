'use strict'
const mongoose = require('mongoose')
const { Schema } = mongoose

const ClientSchema = new Schema({
  name: { type: String, required: [true, 'the name is required'], default: '' },
  lastname: { type: String, required: [true, 'the lastname is required'], default: '' },
  identification: { type: Number, required: [true, 'the identification is required'], default: '' },
  phone: { type: Number, required: false, default: 0 },
  worker: { type: Boolean, required: false, default: false },
  email: { type: String, required: false, default: '' },
  password: { type: String, required: [true, 'the password is required'], default: '' },
  img: { type: String, default: '' },
  state: { type: Boolean, default: false },
  address_gps: { lat: { type: String }, long: { type: String } }, // direccion gps del cliente
  address: { type: String, default: '' }, // direccion del cliente
  phone_mobile: { type: Number, default: 0 },
  city: { type: String, default: '' },
  department: { type: String, default: '' },
  city_residence: { type: String, default: '' },
  rol: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  created_day: { type: String, default: '' },
  created_month: { type: String, default: '' },
  created_year: { type: String, default: '' },
  created_at: { type: String, default: '' },
  updated_at: { type: String, default: '' },
})


const PushNotificationsWebSchema = new Schema({
  firetoken: { type: String },
  platform: { type: String },
  usertype: { type: Number },
  uuid: { type: String }
});



ClientSchema.methods.toJSON = function () {
  const userThis = this;
  const userObject = userThis.toObject();
  delete userObject.password;
  return userObject;
};

var pushNotificacionWebSchema = mongoose.model('pushNotificacions', PushNotificationsWebSchema);
var clientSchema = mongoose.model('userClientes', ClientSchema)
module.exports.clientSchema = clientSchema
module.exports.pushNotificacionWebSchema = pushNotificacionWebSchema