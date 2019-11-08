'use strict'

const jwt = require('jwt-simple')
const moment = require('moment')
const tokenSecret = require('./secret').TOKEN_SECRET

const middleware = {}

middleware.authentication = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(403).send({ message: 'No estas logueado' });
  } else {
    var token = req.headers.authorization.replace(/[""]+/g, '');
    try {
      var payload = jwt.decode(token, tokenSecret);
      if (payload.exp <= moment().unix()) {
        return res.status(401).send({ message: 'El token ha caducado' })
      }
    } catch (error) {
      return res.status(401).send({ message: 'El token no es valido' })
    }
    req.user = payload;
    next();
  }
}

middleware.generateToken = (data) => {
  const payload = {
    sub: data._id,
    email: data.email,
    rol: data.rol,
    state: data.state,
    iat: moment().unix(),
    exp: moment().add(1, 'years').unix()
  }

  return jwt.encode(payload, tokenSecret);

}


module.exports.middleware = middleware
