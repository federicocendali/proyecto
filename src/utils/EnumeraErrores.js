export const TIPOS_ERROR = {
  TIPO_DE_DATOS: { code: 400, message: 'Tipo de datos inválido' },
  ARGUMENTOS_INVALIDOS: { code: 400, message: 'Argumentos inválidos' },
  AUTENTICACION: { code: 401, message: 'Error de autenticación' },
  AUTORIZACION: { code: 403, message: 'Error de autorización' },
  NOT_FOUND: { code: 404, message: 'Recurso no encontrado' },
  INTERNAL_SERVER_ERROR: { code: 500, message: 'Error interno del servidor' },
  BAD_REQUEST: { code: 400, message: 'Solicitud incorrecta' },
  CONFLICT: { code: 409, message: 'Conflicto en la solicitud' },
  PAYLOAD_TOO_LARGE: { code: 413, message: 'Carga útil demasiado grande' },
  UNSUPPORTED_MEDIA_TYPE: { code: 415, message: 'Tipo de medio no soportado' },
  UNPROCESSABLE_ENTITY: { code: 422, message: 'Entidad no procesable' },
  TOO_MANY_REQUESTS: { code: 429, message: 'Demasiadas solicitudes' },
};
