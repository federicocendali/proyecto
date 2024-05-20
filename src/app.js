import express from 'express';
import path from 'path';
import __dirname from './utils.js';
import { engine } from 'express-handlebars';
import connectDB from './connection/MongoDB.js';
import MongoStore from 'connect-mongo';
import { router as productRouter } from './routes/products-router.js';
import { router as cartRouter } from './routes/cart-router.js';
import { router as vistasRouter } from './routes/vistas.router.js';
import { router as sessionsRouter } from './routes/sessions-router.js';
import sessions from 'express-session';
import dotenv from 'dotenv';
import passport from 'passport';
import { initPassport } from './config/passportConfig.js';
dotenv.config();

const port = 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  sessions({
    secret: 'CoderCoder123',
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: 'mongodb+srv://<user>:<password>@cluster<...>', // Solicitar string de conexión
      dbName: 'ecommerce',
      collectionName: 'sessions',
      ttl: 3600,
    }),
  })
);
initPassport();
app.use(passport.initialize());
app.use(passport.session());
connectDB();
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, '/public')));
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/', vistasRouter);
app.use('/', (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.status(200).send('Todo Ok');
});

const serverHTTP = app.listen(port, () =>
  console.log(`Server corriendo en http://localhost:${port}`)
);
serverHTTP.on('error', (err) => console.log(err));
