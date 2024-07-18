import { TIPOS_ERROR } from '../utils/EnumeraErrores.js';

export const errorHandler = (error, req, res, next) => {
  console.log(`${error.cause ? error.cause : error.message}`);
  switch (error.code) {
    case TIPOS_ERROR.INTERNAL_SERVER_ERROR.code:
      res.setHeader('Content-Type', 'application/json');
      return res.status(500).json({ error: `${error.message}` });
    case TIPOS_ERROR.AUTENTICACION.code:
      res.setHeader('Content-Type', 'application/json');
      return res.status(401).json({
        error: `Error de autenticación. Por favor, verifica tus credenciales.`,
      });
    case TIPOS_ERROR.AUTORIZACION.code:
      res.setHeader('Content-Type', 'application/json');
      return res.status(401).json({ error: `Credenciales incorrectas` });
    case TIPOS_ERROR.CONFLICT.code:
      res.setHeader('Content-Type', 'application/json');
      return res.status(409).json({ error: `Conflicto en la solicitud` });
    case TIPOS_ERROR.ARGUMENTOS_INVALIDOS.code:
      res.setHeader('Content-Type', 'application/json');
      return res.status(400).json({ error: `${error.message}` });
    default:
      res.setHeader('Content-Type', 'application/json');
      return res
        .status(500)
        .json({ error: `Error. Contacte al administrador` });
  }
};
