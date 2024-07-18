import passport from 'passport';
import local from 'passport-local';
import passportJWT from 'passport-jwt';
import github from 'passport-github2';
import { UsersManager as UsuariosManager } from '../dao/userManager.js';
import { CartManager } from '../dao/cartManager.js';
import { generaHash, validaPassword } from '../utils.js';
import dotenv from 'dotenv';
import { logger } from '../helper/Logger.js';
dotenv.config();
const usuariosManager = new UsuariosManager();
const cartManager = new CartManager();
const buscaToken = (req) => {
  let token = null;
  if (req.cookies['CookiePrueba']) {
    token = req.cookies['CookiePrueba'];
  }
  return token;
};

export const initPassport = () => {
  passport.use(
    'current',
    new passportJWT.Strategy(
      {
        secretOrKey: process.env.ACCESS_TOKEN_SECRET,
        jwtFromRequest: new passportJWT.ExtractJwt.fromExtractors([buscaToken]),
      },
      async (usuarioToken, done) => {
        try {
          if (usuarioToken.email === ' ' || usuarioToken.password === ' ') {
            logger.warn('Email y Password son obligatorios en el token JWT.');
            return done(null, false, {
              message: 'Email y Password son obligatorios',
            });
          }
          return done(null, usuarioToken);
        } catch (error) {
          logger.error('Error durante la autenticación con JWT', {
            error: error.message,
          });
          return done(error);
        }
      }
    )
  );

  passport.use(
    'register',
    new local.Strategy(
      {
        usernameField: 'email',
        passReqToCallback: true,
      },
      async (req, username, password, done) => {
        try {
          let { first_name, last_name, age } = req.body;
          if (!first_name) {
            return done(null, false, { message: 'Nombre es requerido' });
          }
          let existe = await usuariosManager.getBy({ email: username });
          if (existe) {
            return done(null, false, {
              message: 'El email ya está registrado',
            });
          }
          let nuevoCarrito = await cartManager.createCart();
          password = generaHash(password);
          let nuevoUsuario = await usuariosManager.create({
            first_name,
            last_name,
            email: username,
            age,
            password,
            role: 'user',
            carrito: nuevoCarrito._id,
          });
          logger.info(`Nuevo usuario registrado: ${nuevoUsuario.email}`);
          return done(null, nuevoUsuario);
        } catch (error) {
          logger.error('Error al registrar nuevo usuario', {
            error: error.message,
          });
          return done(error);
        }
      }
    )
  );

  passport.use(
    'login',
    new local.Strategy(
      {
        usernameField: 'email',
      },
      async (username, password, done) => {
        try {
          logger.info(
            `Intento de inicio de sesión para el usuario ${username}`
          );
          let usuario = await usuariosManager.getByPopulate({
            email: username,
          });
          if (!usuario) {
            logger.warn(`Usuario ${username} no encontrado`);
            return done(null, false);
          }
          if (!validaPassword(password, usuario.password)) {
            logger.warn(`Contraseña incorrecta para el usuario ${username}`);
            return done(null, false);
          }
          delete usuario.password;
          logger.info(`Usuario ${username} autenticado con éxito`);
          return done(null, usuario);
        } catch (error) {
          logger.error(
            `Error durante el inicio de sesión para el usuario ${username}`,
            { error: error.message }
          );
          return done(error);
        }
      }
    )
  );

  passport.use(
    'github',
    new github.Strategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL,
      },
      async (tokenAcceso, tokenRefresh, profile, done) => {
        try {
          let email = profile._json.email;
          let first_name = profile._json.name;
          if (!first_name || !email) {
            logger.warn(
              'Perfil de GitHub incompleto. Nombre o email no disponibles.'
            );
            return done(null, false);
          }
          let usuario = await usuariosManager.getByPopulate({ email });
          if (!usuario) {
            let nuevoCarrito = await cartManager.createCart();
            usuario = await usuariosManager.create({
              first_name,
              email,
              profile,
              carrito: nuevoCarrito._id,
            });
            usuario = await usuariosManager.getByPopulate({ email });
          }
          logger.info(
            `Inicio de sesión exitoso con GitHub para el usuario ${usuario.email}`
          );
          return done(null, usuario);
        } catch (error) {
          logger.error('Error durante la autenticación con GitHub', {
            error: error.message,
          });
          return done(error);
        }
      }
    )
  );
};
