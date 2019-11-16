'use strcit'

const mongoose = require('mongoose')
const { Schema } = mongoose

const cliServiceSchema = new Schema({
  fecha_creacion: { type: Number },
  dia_creacion: { type: String },
  mes_creacion: { type: String },
  ano_creacion: { type: String },
  id_tecnico: { type: Schema.Types.ObjectId, ref: "userTecnicos" },
  id_cliente: { type: Schema.Types.ObjectId, ref: "userTecnicos" },
  id_categoria: { type: Schema.Types.ObjectId, ref: "categorys" },
  id_location: { type: Schema.Types.ObjectId, ref: "locations" },
  id_postponed: { type: Schema.Types.ObjectId, ref: "technicalPostponeds" },
  observaciones: { type: String },
  desc_diagnostico: {
    type: String,
    default: "Espere que tecnico llene el diagnostico"
  },
  posible_solucion: {
    type: String,
    default: "Espere que tecnico llene la posible solucion"
  },
  status: { type: Boolean, default: true },
  changeStatus: { type: String, default: "" },
  stateNumServi: { type: Number, default: 0 },
  price_total: { type: Number, default: 0 },
  postPoned: { type: Boolean, default: false },
  reservation: { type: Boolean, default: false },
  created_at: { type: String, default: '' },
  updated_at: { type: String, default: '' },
})

const ServiceWebSchema = new Schema({
  fecha_creacion: { type: Number },
  fecha_creacion_view: { type: String },
  dia_creacion: { type: String },
  mes_creacion: { type: String },
  ano_creacion: { type: String },
  nameLocation: { type: String },
  expediente: { type: String },

  addressLocation: { type: String },
  id_tecnico: { type: Schema.Types.ObjectId, ref: "userTecnicos" },
  id_cliente: { type: Schema.Types.ObjectId, ref: "userClientes" },
  id_categoria: { type: Schema.Types.ObjectId, ref: "categorys" },
  id_location: { type: Schema.Types.ObjectId, ref: "locations" }, // direccion gps del servicio
  id_postponed: { type: Schema.Types.ObjectId, ref: "technicalPostponeds" },
  desc_diagnostico: {
    type: String,
    default: "Espere que tecnico llene el diagnostico"
  },
  posible_solucion: {
    type: String,
    default: "Espere que tecnico llene la posible solucion"
  },
  status: { type: Boolean, default: true },
  observaciones: { type: String },
  changeStatus: { type: String, default: "" },
  stateNumServi: { type: Number, default: 0 },
  price_total: { type: Number, default: 0 },
  postPoned: { type: Boolean, default: false },
  reservation: { type: Boolean, default: false },
  fecha_aplazar_servicio: { type: String },
  hora_aplazar_servicio: { type: String },
  fecha_servicio: { type: String }
})

const technicalPostponedSchema = new Schema({
  id_tecnico: { type: Schema.Types.ObjectId, ref: "userTecnicos" },
  id_service: { type: Schema.Types.ObjectId, ref: "services" },
  justifyA: { type: String, default: "" },
  stateService: { type: String, default: "" },
  dateService: { type: String, default: "" },
  stateA: { type: Number, default: 0 }, // 1 validando , 2. fecha aceptada, 3 fecha no acpetada
  flagA: { type: Boolean, default: false }
})

const RerservationSchema = new Schema({
  id_cliente: { type: Schema.Types.ObjectId, ref: "userTecnicos" },
  id_service: { type: Schema.Types.ObjectId, ref: "services" },
  dateReservation: { type: String, default: "" },
  stateReservation: { type: Boolean, default: false }
})

const services = mongoose.model("services", cliServiceSchema)
const servicesWeb = mongoose.model("servicesweb", ServiceWebSchema)

module.exports.Postpone = mongoose.model("technicalPostponeds", technicalPostponedSchema)
module.exports.Reservation = mongoose.model("reservations", RerservationSchema)
module.exports.services = services
module.exports.servicesWeb = servicesWeb