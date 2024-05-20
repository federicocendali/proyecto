import { usuariosModelo } from './models/users.model.js';

export class UsuariosManagerMongo {
  async create(usuario) {
    let nuevoUsuario = await usuariosModelo.create(usuario);
    return nuevoUsuario.toJSON();
  }

  async getBy(filtro = {}) {
    return await usuariosModelo.findOne(filtro).lean();
  }
}
