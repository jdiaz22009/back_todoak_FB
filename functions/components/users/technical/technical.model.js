'use strict'
const mongoose = require('mongoose')
const { Schema } = mongoose

const TechnicalSchema = Schema({
  name: { type: String, required: [true, 'the name is required'], default: '' },
  lastname: { type: String, required: [true, 'the lastname is required'], default: '' },
  identification: { type: Number, required: [true, 'the identification is required'], default: '' },
  phone: { type: Number, default: 0 }, // phone fijo tecnico
  date: { type: Date, required: [false, "date is required"], default: "" },
  worker: { type: Boolean, required: false, default: false },
  email: { type: String, required: false, default: '' },
  password: { type: String, required: [true, 'the password is required'], default: '' },
  img: { type: String, default: '' },
  role: { type: String, default: '' },
  tokens: { type: Schema.Types.ObjectId, ref: "pushNotificacions" },
  stateConect: { type: Boolean, default: false },
  state: { type: Boolean, default: false },
  address: [{ type: Schema.Types.ObjectId, ref: "locations" }], // direccion cliente
  estado_rrhh: { type: Schema.Types.ObjectId, ref: "staterrhh" },
  addressResidence: { type: String, default: "" },
  phone_mobile: { type: Number, default: 0 },
  city_residence: { type: String, default: "" },
  have_moto: { type: String, default: "" },
  workCategory: { type: Schema.Types.ObjectId, ref: "categorys" },
  workSubca: { type: String, default: "" },
  addDocuments: {
    document: { type: String, default: "" },
    Hvida: { type: String, default: "" },
    PJudicial: { type: String, default: "" },
    FSoat: { type: String, default: "" },
    FTecnomecanica: { type: String, default: "" },
    FAzul: { type: String, default: "" }
  },
  isActive: { type: Boolean, default: true },
  created_date_view: { type: String, default: '' },
  created_day: { type: String, default: '' },
  created_month: { type: String, default: '' },
  created_year: { type: String, default: '' },
  created_at: { type: String, default: '' },
  updated_at: { type: String, default: '' }
})

const StateRRHHSchema = new Schema({
  name: { type: String, default: '' },
  description: { type: String, default: '' },
  sequence: { type: String, default: '' }
})

const LocationsSchema = new Schema({
  nameLocation: { type: String },
  addressLocation: { type: String },
  lat: { type: String },
  lng: { type: String }
});

const PushNotificationsSchema = new Schema({
  firetoken: { type: String },
  platform: { type: String },
  usertype: { type: Number },
  uuid: { type: String }
});

TechnicalSchema.methods.toJSON = function () {
  const userThis = this;
  const userObject = userThis.toObject();
  delete userObject.password;
  return userObject;
};

var userTecnicos = mongoose.model('userTecnicos', TechnicalSchema)
var pushNotificacionsSchema = mongoose.model('pushNotificacions', PushNotificationsSchema)
var locationsSchema = mongoose.model("locations", LocationsSchema);
var stateRRHH = mongoose.model("staterrhhs", StateRRHHSchema);

module.exports.userTecnicos = userTecnicos;
module.exports.pushNotificacionsSchema = pushNotificacionsSchema;
module.exports.locationsSchema = locationsSchema;
module.exports.StateRRHH = stateRRHH;

