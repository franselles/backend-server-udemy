var express = require('express');
var mdAuntenticacion = require('../middlewares/autentication');

var Medico = require('../models/medico');

var app = express();

// Obten todos los médicos
app.get('/', (req, res, next) => {
  var desde = req.query.desde || 0;
  desde = Number(desde);

  Medico.find({})
    .skip(desde)
    .limit(5)
    .populate('usuario', 'nombre email')
    .populate('hospital')
    .exec((err, medicos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: 'Error en base de medicos',
          errors: err
        });
      }

      Medico.count({}, (err, cuenta) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            mensaje: 'Error en base de usuarios',
            errors: err
          });
        }

        res.status(200).json({
          ok: true,
          medicos: medicos,
          cuenta: cuenta
        });
      });
    });
});

// Actualiza medico
app.put('/:id', mdAuntenticacion.verificaToken, (req, res, next) => {
  var id = req.params.id;
  var body = req.body;

  Medico.findById(id, (err, medico) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error en base de medicos',
        errors: err
      });
    }

    if (!medico) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Error al buscar medico, no existe',
        errors: err
      });
    }

    medico.nombre = body.nombre;
    medico.img = body.img;
    medico.usuario = req.usuario._id;
    medico.hospital = body.hospital;

    medico.save((err, medicoGuardado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Error al actualizar medico',
          errors: err
        });
      }

      res.status(201).json({
        ok: true,
        medicoGuardado: medicoGuardado
      });
    });
  });
});

// Crear medico
app.post('/', mdAuntenticacion.verificaToken, (req, res, next) => {
  var body = req.body;

  var medico = new Medico({
    nombre: body.nombre,
    img: body.img,
    usuario: req.usuario._id,
    hospital: body.hospital
  });

  medico.save((err, medicoGuardado) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al crear medico',
        errors: err
      });
    }

    res.status(201).json({
      ok: true,
      medicoGuardado: medicoGuardado
    });
  });
});

// Borrar medico
app.delete('/:id', mdAuntenticacion.verificaToken, (req, res, next) => {
  var id = req.params.id;

  Medico.findByIdAndRemove(id, (err, medicoBorrado) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al borrar medico',
        errors: err
      });
    }

    if (!medicoBorrado) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al borrar medico, no existe medico',
        errors: err
      });
    }

    res.status(200).json({
      ok: true,
      medicoBorrado: medicoBorrado
    });
  });
});

module.exports = app;
