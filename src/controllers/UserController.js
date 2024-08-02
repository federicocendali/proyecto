import { userService } from '../services/UserService.js';
import jwt from 'jsonwebtoken';
import { generaHash, validaPassword } from '../utils.js';
import { isValidObjectId } from 'mongoose';
import dotenv from 'dotenv';
import { enviarEmail } from '../helper/nodeMailer.js';
import { logger } from '../helper/Logger.js';
dotenv.config();

const SECRET = process.env.ACCESS_TOKEN_SECRET;

export class UserController {
  static getRestablecerClave = async (req, res) => {
    let { email } = req.body;
    try {
      let usuario = await userService.checkEmail(email);
      if (usuario) {
        let token = jwt.sign({ _id: usuario._id }, SECRET, { expiresIn: '1h' });
        res.cookie('usercookie', token, { httpOnly: true });
        let estructuraHTML = `<h2>Haga click en el siguiente link para reestablecer su contraseña</h2>
                                      <a href="http://localhost:8080/crearNuevaClave/${token}">Restablecer contraseña</a>`;
        await enviarEmail(
          usuario.email,
          'Restablecimiento de contraseña CODER',
          estructuraHTML
        );
        res.setHeader('Content-Type', 'text/html');
        res.status(200).json({
          message: `<b>Abre tu correo en ${usuario.email} para restablecer su contraseña</b> `,
          token: token,
        });
      } else {
        res.setHeader('Content-Type', 'text/html');
        res.status(200).json('No existe el email requerido en nuestra DB');
      }
    } catch (error) {
      console.error('Error en getRestablecerClave:', error);
      res.setHeader('Content-Type', 'application/json');
      res.status(500).json({
        Error:
          'Error 500 - Error inesperado en el servidor al buscar el email del usuario',
      });
    }
  };

  static getCorroborarNuevaClave = async (req, res) => {
    if (!req.cookies.usercookie) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(400).json({
        message: 'Ya fue realizada la modificación de la clave con éxito',
      });
    }
    let { password } = req.body;
    let token = req.params.token;
    let decoded;
    try {
      decoded = jwt.verify(token, SECRET);
    } catch (err) {
      logger.error('Error al verificar el token:', err.message);
      return res.status(400).json({ error: 'El token no es válido.' });
    }
    console.log('Password recibido:', password);
    console.log('Token decodificado:', decoded);
    let id = decoded._id;
    try {
      let usuario = await userService.getUserById(id);
      if (!usuario) {
        logger.error('Usuario no encontrado con ID:', id);
        return res.status(404).json({ error: 'Usuario no encontrado.' });
      }
      if (!validaPassword(password, usuario.password)) {
        logger.debug(
          'Bien, la contraseña es diferente a la anterior, ahora la hasheamos y la actualizamos'
        );
        let hashedPassword = generaHash(password);
        await userService.updatePassword(id, hashedPassword);
        logger.info(
          `Contraseña actualizada para el usuario ${usuario.email}: ${hashedPassword}`
        );
        res.clearCookie('usercookie');
        return res.redirect('/login');
        res.setHeader('Content-Type', 'text/html');
        res
          .status(400)
          .json(
            '<b>contraseña nueva confirmada con exito, ve al inicio de sesion</b>'
          );
      } else {
        res.setHeader('Content-Type', 'text/html');
        return res
          .status(400)
          .json(
            'La nueva contraseña no puede ser igual a la registrada en nuestra DB'
          );
      }
    } catch (error) {
      logger.error('Error al actualizar la contraseña:', error);
      res.setHeader('Content-Type', 'application/json');
      return res.status(500).json({
        error: 'Error en el Servidor al querer actualizar la clave del usuario',
      });
    }
  };

  static getPremium = async (req, res) => {
    const id = req.params.uid;
    if (!isValidObjectId(id)) {
      res.setHeader('Content-Type', 'application/json');
      return res.status(400).json({
        message: 'Error, el id requerido no tiene un formato válido de MongoDB',
      });
    }
    try {
      const usuario = await userService.getUserById(id);
      if (!usuario) {
        res.setHeader('Content-Type', 'application/json');
        return res
          .status(400)
          .json('No hay ningún usuario registrado con el id proporcionado');
      }
      const nuevoRol = usuario.role === 'usuario' ? 'premium' : 'usuario';
      const nuevoUsuario = await userService.updateRol(id, nuevoRol);
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).json(nuevoUsuario);
    } catch (error) {
      logger.error('Error al modificar el rol del usuario:', error);
      res.setHeader('Content-Type', 'application/json');
      return res.status(500).json({
        error: 'Error en el Servidor al querer modificar el rol del usuario',
      });
    }
  };
}
