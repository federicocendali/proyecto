import mongoose from 'mongoose';
import { configEntornoClusterMDB } from '../config/config.js';
import { logger } from '../helper/Logger.js';

const connectDB = async () => {
  try {
    await mongoose.connect(configEntornoClusterMDB.CLUSTER);
    logger.info('Conectado a la base de datos de MongoDB');
  } catch (error) {
    logger.error('Error al conectar a la base de datos de MongoDB', {
      error: error.message,
    });
  }
};

export default connectDB;
