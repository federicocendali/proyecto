import mongoose from 'mongoose';

export const usuariosModelo = mongoose.model(
  'Users',
  new mongoose.Schema({
    nombre: String,
    email: {
      type: String,
      unique: true,
    },
    password: String,
    rol: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    cart: {
      type: mongoose.Types.ObjectId,
      ref: 'carts',
    },
  })
);
