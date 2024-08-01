import { Router } from 'express';
import { middLogger } from '../middleware/MidlewareLogger.js';
export const router = Router();

router.use(middLogger);
router.get('/loggerTest', (req, res) => {
  req.logger.fatal('Este es un mensaje fatal');
  req.logger.error('Este es un mensaje de error');
  req.logger.warn('Este es un mensaje de advertencia');
  req.logger.info('Este es un mensaje informativo');
  req.logger.http('Este es un mensaje HTTP');
  req.logger.debug('Este es un mensaje de depuración');
  res.send(
    'Mensajes de logging generados con exito. \n Revisa tu consola (en desarrollo) o el archivo de logs (en producción).'
  );
});
