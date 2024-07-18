export class UsuariosDTO {
  constructor(usuario) {
    this.nombre = usuario.nombre;
    this.carrito = usuario.carrito;
    this.email = usuario.email;
    this.rol = usuario.rol;
  }
}
