import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import multer from 'multer';
import passport from 'passport';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default __dirname;
import { TIPOS_ERROR } from './utils/EnumeraErrores.js';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './src/uploads');
  },
  filename: function (req, file, cb) {
    let tipo = file.mimetype.split('/')[0];
    if (tipo !== 'image') {
      return cb(new Error('Solo se admiten imagenes...!'));
    }
    cb(null, Date.now() + '-' + file.originalname);
  },
});

export const passportCall = (estrategia) => {
  return function (req, res, next) {
    passport.authenticate(estrategia, function (err, user, info, status) {
      if (err) {
        return next(err);
      }
      if (!user) {
        res.setHeader('Content-Type', 'application/json');
        return res
          .status(401)
          .json({ error: info.message ? info.message : info.toString() });
      }
      req.user = user;
      return next();
    })(req, res, next);
  };
};

export const upload = multer({ storage: storage });
export const SECRET = 'CoderCoder123';
export const generaHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const validaPassword = (password, hash) =>
  bcrypt.compareSync(password, hash);

export const isValidObjectId = (id) => {
  return (
    mongoose.Types.ObjectId.isValid(id) &&
    new mongoose.Types.ObjectId(id).toString() === id
  );
};

export class CustomError {
  static createError(
    name = 'Error',
    cause,
    message,
    code = TIPOS_ERROR.INTERNAL_SERVER_ERROR
  ) {
    const error = new Error(message, { cause: cause });
    error.name = name;
    error.code = code;

    throw error;
  }
}
