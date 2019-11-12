'use strict'
const moment = require('moment')
const moments = {}

moments.format = unix => {
  return moment().format(unix); Í
}

module.exports = moments