import { Router } from 'express';
import { logger } from '../helper/Logger.js';
export const router = Router();

router.get('/loggerTest', (req, res) => {
  logger.error('Este es un mensaje de error');
  logger.warn('Este es un mensaje de advertencia');
  logger.info('Este es un mensaje informativo');
  logger.http('Este es un mensaje HTTP');
  logger.debug('Este es un mensaje de depuración');
  res.send(
    'Mensajes de logging generados. Revisa tu consola (en desarrollo) o el archivo de logs (en producción).'
  );
});
