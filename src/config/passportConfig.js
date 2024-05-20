import passport from 'passport';
import local from 'passport-local';
import github from 'passport-github2';
import { UsuariosManagerMongo as UsuariosManager } from '../dao/userManagerMONGO.js';
import { generaHash, validaPassword } from '../utils.js';

const usuariosManager = new UsuariosManager();

export const initPassport = () => {
  passport.use(
    'register',
    new local.Strategy(
      {
        usernameField: 'email',
        passReqToCallback: true,
      },
      async (req, username, password, done) => {
        try {
          let { nombre } = req.body;
          if (!nombre) {
            return done(null, false, { message: 'Nombre es requerido' });
          }
          let existe = await usuariosManager.getBy({ email: username });
          if (existe) {
            return done(null, false, {
              message: 'El email ya está registrado',
            });
          }
          password = generaHash(password);
          let nuevoUsuario = await usuariosManager.create({
            nombre,
            email: username,
            password,
            rol: 'user',
          });
          return done(null, nuevoUsuario);
        } catch (error) {
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
          let usuario = await usuariosManager.getBy({ email: username });
          if (!usuario) {
            return done(null, false);
          }
          if (!validaPassword(password, usuario.password)) {
            return done(null, false);
          }
          return done(null, usuario);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  passport.use(
    'github',
    new github.Strategy(
      {
        clientID: '',
        clientSecret: '',
        callbackURL: 'http://localhost:8080/api/sessions/devolucionGithub',
      },
      async (tokenAcceso, tokenRefresh, profile, done) => {
        try {
          let email = profile._json.email;
          let nombre = profile._json.name;
          if (!nombre || !email) {
            return done(null, false);
          }
          let usuario = await usuariosManager.getBy({ email });
          if (!usuario) {
            usuario = await usuariosManager.create({
              nombre,
              email,
              profile,
            });
          }
          return done(null, usuario);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  passport.serializeUser((usuario, done) => {
    return done(null, usuario._id);
  });
  passport.deserializeUser(async (id, done) => {
    let usuario = await usuariosManager.getBy({ _id: id });
    return done(null, usuario);
  });
};
