import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { logger } from '../helper/Logger.js';

dotenv.config();

export const authTokenPermisos = (permisos = []) => {
  return (req, res, next) => {
    permisos = permisos.map((p) => p.toLowerCase());
    if (permisos.includes('public')) {
      return next();
    }
    if (!req.user?.role) {
      logger.warn(`Intento de acceso sin rol autorizado: ${req.user}`);
      res.setHeader('Content-Type', 'application/json');
      return res.status(401).json({
        error: `No tienes los roles permitidos para acceder a esta información`,
      });
    }
    if (!permisos.includes(req.user.role.toLowerCase())) {
      logger.warn(`Acceso denegado por rol insuficiente: ${req.user.role}`);
      res.setHeader('Content-Type', 'application/json');
      return res
        .status(403)
        .json({ error: `Acceso denegado por rol insuficiente` });
    }
    logger.info(`Acceso autorizado para usuario con rol: ${req.user.role}`);
    return next();
  };
};

export const authToken = (req, res, next) => {
  const token = req.cookies.CookiePrueba;
  if (!token) {
    return res.status(401).json({ message: 'Token no provisto' });
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Fallo al autenticar token' });
    }
    req.user = decoded;
    next();
  });
};
