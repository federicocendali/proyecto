import { UsersManager } from '../dao/userManager.js';

class UserService {
  constructor(dao) {
    this.dao = dao;
  }
  checkEmail = async (email) => {
    try {
      return await this.dao.getBy({ email: email });
    } catch (error) {
      throw new Error(
        'Error desde UserService, al buscar el usuario por email'
      );
    }
  };
  updatePassword = async (id, hashedPassword) => {
    console.log('Desde UserService Nueva contraseña hasheada:', hashedPassword);
    const resultado = await this.dao.update(id, { password: hashedPassword });
    console.log('Desde UserService Resultado de actualización:', resultado);
    return resultado;
  };
  updateRol = async (id, nuevoRol) => {
    return this.dao.updateRol(id, nuevoRol);
  };
  getUserById = async (id) => {
    return this.dao.getBy({ _id: id });
  };
}

export const userService = new UserService(new UsersManager());
