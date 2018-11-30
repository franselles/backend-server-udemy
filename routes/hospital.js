var express = require('express');
var mdAuntenticacion = require('../middlewares/autentication');

var Hospital = require('../models/hospital');

var app = express();

// Obtener todos los hospitales
app.get('/', (req, res, next) => {
  var desde = req.query.desde || 0;
  desde = Number(desde);

  Hospital.find({})
    .skip(desde)
    .limit(5)
    .populate('usuario', 'nombre email')
    .exec((err, hospitales) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: 'Error en base de hospitales',
          errors: err
        });
      }

      Hospital.count({}, (err, cuenta) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            mensaje: 'Error en base de usuarios',
            errors: err
          });
        }

        res.status(200).json({
          ok: true,
          hospitales: hospitales,
          cuenta: cuenta
        });
      });
    });
});

// Actualiza hospital
app.put('/:id', mdAuntenticacion.verificaToken, (req, res, next) => {
  var id = req.params.id;
  var body = req.body;

  Hospital.findById(id, (err, hospital) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al buscar hospital',
        errors: err
      });
    }

    if (!hospital) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Error al buscar hospital, no existe',
        errors: err
      });
    }

    hospital.nombre = body.nombre;
    hospital.usuario = req.usuario._id;
    hospital.img = body.img;

    hospital.save((err, hospitalGuardado) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Error al guardar hospital',
          errors: err
        });
      }
      res.status(201).json({
        ok: true,
        hospitalGuardado: hospitalGuardado
      });
    });
  });
});

// Crea hospital
app.post('/', mdAuntenticacion.verificaToken, (req, res, next) => {
  var body = req.body;

  const hospital = new Hospital({
    nombre: body.nombre,
    usuario: req.usuario._id,
    img: body.img
  });

  hospital.save((err, hospitalGuardado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Error al crear hospital',
        errors: err
      });
    }
    res.status(201).json({
      ok: true,
      hospitalGuardado: hospitalGuardado
    });
  });
});

// Borrar hospital
app.delete('/:id', mdAuntenticacion.verificaToken, (req, res, next) => {
  var id = req.params.id;

  Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        mensaje: 'Error al borrar hospital',
        errors: err
      });
    }

    if (!hospitalBorrado) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Error al borrar hospital, no existe hospital',
        errors: err
      });
    }

    res.status(200).json({
      ok: true,
      hospitalBorrado: hospitalBorrado
    });
  });
});

module.exports = app;
