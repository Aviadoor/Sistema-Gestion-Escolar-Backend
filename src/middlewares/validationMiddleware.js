// =============================================
// SANTO TOMÁS DE AQUINO — Middleware de Validación
// Reglas para POST, PUT, PATCH y Prevención SQLi
// =============================================

const { detectarInyeccionEnObjeto, esEnteroPositivo } = require('../utils/sanitizador');

/**
 * Middleware global para inspeccionar body, query y params contra patrones de Inyección SQL.
 */
function prevenirInyeccionSQL(req, res, next) {
  const fuentes = [
    { datos: req.body, nombre: 'body' },
    { datos: req.query, nombre: 'query' },
    { datos: req.params, nombre: 'params' },
  ];

  for (const { datos, nombre } of fuentes) {
    const campoSospechoso = detectarInyeccionEnObjeto(datos, nombre);
    if (campoSospechoso) {
      return res.status(400).json({
        mensaje: `Entrada rechazada por seguridad en ${campoSospechoso}.`,
      });
    }
  }

  next();
}

/**
 * Crea un middleware de validación para rutas POST, PUT y PATCH a partir de una función validadora.
 * @param {(body: object, req: object) => string|null} validadorFn
 */
function validarBody(validadorFn) {
  return (req, res, next) => {
    const error = validadorFn(req.body || {}, req);
    if (error) {
      return res.status(400).json({ mensaje: error });
    }
    next();
  };
}

/**
 * Valida que el parámetro de ruta indicado sea un ID entero positivo válido.
 */
function validarParamId(nombreParam = 'id') {
  return (req, res, next) => {
    const valor = req.params[nombreParam];
    if (!esEnteroPositivo(valor)) {
      return res.status(400).json({
        mensaje: `El parámetro ${nombreParam} debe ser un número entero válido.`,
      });
    }
    next();
  };
}

module.exports = {
  prevenirInyeccionSQL,
  validarBody,
  validarParamId,
};

