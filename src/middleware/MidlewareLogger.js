import { logger } from '../helper/Logger.js';

export const middLogger = (req, res, next) => {
  req.logger = logger;
  next();
};
