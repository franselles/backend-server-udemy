var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');

var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

var app = express();
app.use(fileUpload());

app.put('/:tipo/:id', (req, res, next) => {
  var id = req.params.id;
  var tipo = req.params.tipo;

  var tiposValidos = ['hospitales', 'medicos', 'usuarios'];

  if (tiposValidos.indexOf(tipo) < 0) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Coleecion no valida',
      error: {
        mensaje:
          'Coleecion no valida, colecciones validas: ' + tiposValidos.join(', ')
      }
    });
  }

  if (!req.files) {
    return res.status(400).json({
      ok: false,
      mensaje: 'No selecciono ningún fichero',
      error: { mensaje: 'Debe seleccionar un fichero' }
    });
  }

  var archivo = req.files.imagen;
  var temp = archivo.name.split('.');
  var extension = temp[temp.length - 1];

  var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

  if (extensionesValidas.indexOf(extension) < 0) {
    return res.status(400).json({
      ok: false,
      mensaje: 'Extensión no válida',
      error: {
        mensaje: 'Las extensiones válidas son ' + extensionesValidas.join(', ')
      }
    });
  }

  var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;
  var path = `./upload/${tipo}/${nombreArchivo}`;

  archivo.mv(path, err => {
    if (err) {
      return res.status(400).json({
        ok: false,
        mensaje: 'No se pudo guardar',
        error: {
          mensaje: 'No se pudo guardar'
        }
      });
    }

    subirPorTipo(tipo, id, nombreArchivo, res);
  });
});

function subirPorTipo(tipo, id, nombreArchivo, res) {
  if (tipo === 'usuarios') {
    Usuario.findById(id, (err, usuario) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: 'No se pudo encontrar usuario',
          error: {
            mensaje: err
          }
        });
      }

      if (!usuario) {
        return res.status(400).json({
          ok: false,
          mensaje: 'No se pudo encontrar usuario',
          error: {
            mensaje: err
          }
        });
      }

      var pathViejo = './upload/usuarios/' + usuario.img;

      if (fs.existsSync(pathViejo)) {
        fs.unlink(pathViejo);
      }

      usuario.img = nombreArchivo;

      usuario.save((err, usuarioActualizado) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            mensaje: 'No se pudo guardar imagen usuario',
            error: {
              mensaje: err
            }
          });
        }

        usuarioActualizado.password = ':-)';

        return res.status(200).json({
          ok: true,
          mensaje: 'Imagen usuario actualizada',
          usuarioActualizado
        });
      });
    });
  }

  if (tipo === 'medicos') {
    Medico.findById(id, (err, medico) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: 'No se pudo encontrar medico',
          error: {
            mensaje: err
          }
        });
      }

      if (!medico) {
        return res.status(400).json({
          ok: false,
          mensaje: 'No se pudo encontrar medico',
          error: {
            mensaje: err
          }
        });
      }

      var pathViejo = './upload/medicos/' + medico.img;

      if (fs.existsSync(pathViejo)) {
        fs.unlink(pathViejo);
      }

      medico.img = nombreArchivo;

      medico.save((err, medicoActializado) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            mensaje: 'No se pudo guardar imagen medico',
            error: {
              mensaje: err
            }
          });
        }

        return res.status(200).json({
          ok: true,
          mensaje: 'Imagen medico actualizada',
          medicoActializado
        });
      });
    });
  }

  if (tipo === 'hospitales') {
    Hospital.findById(id, (err, hospital) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          mensaje: 'No se pudo encontrar hospital',
          error: {
            mensaje: err
          }
        });
      }

      if (!hospital) {
        return res.status(400).json({
          ok: false,
          mensaje: 'No se pudo encontrar hospital',
          error: {
            mensaje: err
          }
        });
      }

      var pathViejo = './upload/usuarios/' + hospital.img;

      if (fs.existsSync(pathViejo)) {
        fs.unlink(pathViejo);
      }

      hospital.img = nombreArchivo;

      hospital.save((err, hospitalActualizado) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            mensaje: 'No se pudo guardar imagen hospital',
            error: {
              mensaje: err
            }
          });
        }

        return res.status(200).json({
          ok: true,
          mensaje: 'Imagen hospital actualizada',
          hospitalActualizado
        });
      });
    });
  }
}

module.exports = app;
