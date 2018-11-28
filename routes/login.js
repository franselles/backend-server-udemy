var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

var Usuario = require('../models/usuario');

var app = express();

// Eviar login

app.post('/', (req, res, next) => {
  var body = req.body;

  Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al buscar usuario',
        errors: err
      });
    }

    if (!usuarioDB) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Error al buscar usuario, no exite - email',
        errors: err
      });
    }

    if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Error al buscar usuario, no exite - password',
        errors: err
      });
    }

    usuarioDB.password = ':-)';

    // Generar Token
    var token = jwt.sign({ usuario: usuarioDB }, SEED, {
      expiresIn: 14400
    });

    res.status(200).json({
      ok: true,
      token: token,
      usuario: usuarioDB,
      id: usuarioDB.id
    });
  });
});

module.exports = app;
