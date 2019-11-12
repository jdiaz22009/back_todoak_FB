'use strict'
const moment = require('moment')
const libs = {}

libs.format = unix => {
  return moment().format(unix)
}





module.exports = libs