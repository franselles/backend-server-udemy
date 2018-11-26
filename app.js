// Requires
const express = require('express');
const mongoose = require('mongoose');

// Inicializacion variables
const app = express();

// Conexión a la base de datos
mongoose.connection.openUri(
  'mongodb://localhost:27017/hospitalDB',
  (err, res) => {
    if (err) throw err;
    console.log('Base de datos 21017: \x1b[36m%s\x1b[0m', 'online');
  }
);

// Rutas
app.get('/', (req, res, next) => {
  res.status(200).json({
    ok: true,
    mensaje: 'Petición realizada correctamente'
  });
});

// Escuchar petciones
app.listen(3000, () => {
  console.log(
    'Escuchado el servidor en puerto 3000: \x1b[36m%s\x1b[0m',
    'online'
  );
});
