import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://<user>:<password>@cluster<...>` // Solicitar string de conexión
    );
    console.log('Conectado a la base de datos de MongoDB');
  } catch (error) {
    console.log(
      'Error al conectar a la base de datos de MongoDB',
      error.message
    );
  }
};

export default connectDB;
