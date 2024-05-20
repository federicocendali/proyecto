import { Router } from 'express';
import passport from 'passport';

export const router = Router();

router.get('/error', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  return res.status(500).json({
    error: `Error en el servidor`,
    detalle: `Fallo al autenticar.`,
  });
});

router.post(
  '/register',
  passport.authenticate('register', { failureRedirect: 'api/sessions/error' }),
  async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    return res
      .status(201)
      .json({ payload: 'REGISTRO OK', nuevoUsuario: req.user });
  }
);

router.post(
  '/login',
  passport.authenticate('login', { failureRedirect: '/api/sessions/error' }),
  async (req, res) => {
    let { web } = req.body;
    let usuario = { ...req.user };
    delete usuario.password;
    req.session.usuario = usuario;
    if (web) {
      res.redirect('/');
    } else {
      res.setHeader('Content-Type', 'application/json');
      return res.status(200).json({ payload: 'Login correcto', usuario });
    }
  }
);

router.get('/github', passport.authenticate('github', {}), async () => {});

router.get(
  '/devolucionGithub',
  passport.authenticate('github', { failureRedirect: '/api/sessions/error' }),
  async (req, res) => {
    req.session.usuario = req.user;
    return res.redirect('/');
  }
);

router.get('/logout', (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error(error);
      res.setHeader('Content-Type', 'application/json');
      return res.status(500).json({
        error: 'Error en el servidor',
        detalle: error.message,
      });
    }
    res.redirect('/login');
  });
});
