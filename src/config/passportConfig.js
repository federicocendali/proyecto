import passport from 'passport';
import local from 'passport-local';
import github from 'passport-github2';
import { UsersController as UsuariosManager } from '../controllers/userController.js';
import CartManager from '../controllers/cartController.js';
import { generaHash, validaPassword } from '../utils.js';

const usuariosManager = new UsuariosManager();
const cartManager = new CartManager();

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
          let nuevoCarrito = await cartManager.createCart();
          password = generaHash(password);
          let nuevoUsuario = await usuariosManager.create({
            nombre,
            email: username,
            password,
            carrito: nuevoCarrito._id,
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
          if (
            username == 'adminCoder@coder.com' &&
            password == 'adminCod3r123'
          ) {
            let usuario = {
              _id: 'idAdmin',
              nombre: 'admin',
              email: username,
              carrito: { _id: '664d10c5bbd2e4bf27e832c3' },
              rol: 'admin',
            };
            return done(null, usuario);
          }
          let usuario = await usuariosManager.getByPopulate({
            email: username,
          });
          if (!usuario) {
            return done(null, false);
          }
          if (!validaPassword(password, usuario.password)) {
            return done(null, false);
          }
          delete usuario.password;
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
          let usuario = await usuariosManager.getByPopulate({ email });
          if (!usuario) {
            let nuevoCarrito = await cartManager.createCart();
            usuario = await usuariosManager.create({
              nombre,
              email,
              profile,
              carrito: nuevoCarrito._id,
            });
            let usuario = await usuariosManager.getByPopulate({ email });
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
    let usuario;
    if (id === 'idAdmin') {
      usuario = {
        _id: 'idAdmin',
        nombre: 'admin',
        email: 'adminCoder@coder.com',
        carrito: { _id: '664d10c5bbd2e4bf27e832c3' },
        rol: 'admin',
      };
    } else {
      usuario = await usuariosManager.getBy({ _id: id });
    }
    return done(null, usuario);
  });
};
