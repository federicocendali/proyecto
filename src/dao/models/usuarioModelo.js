import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String },
  email: { type: String, required: true, unique: true },
  age: { type: Number },
  password: { type: String },
  carrito: { type: mongoose.Schema.Types.ObjectId, ref: 'carts' },
  role: { type: String, default: 'user' },
});

export const usuarioModelo = mongoose.model('users', userSchema);
