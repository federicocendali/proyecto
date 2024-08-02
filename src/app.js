import express from 'express';
import path from 'path';
import __dirname from './utils.js';
import { engine } from 'express-handlebars';
import connectDB from './connection/MongoDB.js';
import { router as productRouter } from './router/products-router.js';
import { router as cartRouter } from './router/cart-router.js';
import { router as vistasRouter } from './router/vistas.router.js';
import { router as sessionsRouter } from './router/sessions-router.js';
import { router as errorRouter } from './router/error-router.js';
import { router as usersRouter } from './router/usersRouter.js';
import socketChat from './socket/socketChat.js';
import socketProducts from './socket/socketProducts.js';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import { initPassport } from './config/passportConfig.js';
import { configVarEntorno } from './config/config.js';
import compression from 'express-compression';
import { errorHandler } from './middleware/manejadorErrores.js';
import { middLogger } from './middleware/MidlewareLogger.js';
import { logger } from './helper/Logger.js';
dotenv.config();

const app = express();
const port = configVarEntorno.PORT;

app.use(express.json());
app.use(middLogger);
app.use(compression({}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser('CoderBack'));

initPassport();
app.use(passport.initialize());

connectDB();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/views'));

app.use(express.static(path.join(__dirname, '/public')));

app.use('/error', (req, res) => {
  console.log(asdasd);
  res.setHeader('Content-Type', 'text/plain');
  res.status(200).send('Todo Ok');
});
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/error', errorRouter);
app.use('/api/users', usersRouter);

app.use('/', vistasRouter);

app.use(errorHandler);

app.use((req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.status(200).send('Todo Ok');
});

const serverHTTP = app.listen(port, () => {
  logger.info(`Server corriendo en http://localhost:${port}`);
  serverHTTP.on('error', (err) => console.log(err));
});

const socketServer = new Server(serverHTTP);
socketProducts(socketServer);
socketChat(socketServer);
