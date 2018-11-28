var express = require('express');
var bcrypt = require('bcryptjs');
var mdAuntenticacion = require('../middlewares/autentication');

var Usuario = require('../models/usuario');

var app = express();

// Obtener usuarios

app.get('/', (req, res, next) => {
  Usuario.find({}, 'nombre email img role').exec((err, usuarios) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error en base de usuarios',
        errors: err
      });
    }
    res.status(200).json({
      ok: true,
      usuarios: usuarios
    });
  });
});

// Actualizar usuario

app.put('/:id', mdAuntenticacion.verificaToken, (req, res, next) => {
  var id = req.params.id;
  var body = req.body;

  Usuario.findById(id, (err, usuario) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al buscar usuario',
        errors: err
      });
    }

    if (!usuario) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Error al buscar usuario, no existe',
        errors: err
      });
    }

    usuario.nombre = body.nombre;
    usuario.email = body.email;
    usuario.role = body.role;

    usuario.save((err, usuarioGuardado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Error al actualizar usuario',
          errors: err
        });
      }

      usuarioGuardado.password = ':-)';

      res.status(200).json({
        ok: true,
        usuario: usuarioGuardado,
        usuarioToken: req.usuario
      });
    });
  });
});

// Crear usuario

app.post('/', mdAuntenticacion.verificaToken, (req, res, next) => {
  var body = req.body;

  const usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    img: body.img,
    role: body.role
  });

  usuario.save((err, usuarioGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Error al crear usuario',
        errors: err
      });
    }

    res.status(201).json({
      ok: true,
      usuario: usuarioGuardado
    });
  });
});

// Borrar usuario

app.delete('/:id', mdAuntenticacion.verificaToken, (req, res, next) => {
  var id = req.params.id;

  Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al borrar usuario',
        errors: err
      });
    }

    if (!usuarioBorrado) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Error al borrar usuario, no existe usuario',
        errors: err
      });
    }

    res.status(201).json({
      ok: true,
      usuario: usuarioBorrado
    });
  });
});

module.exports = app;
