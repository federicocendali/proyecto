import express from 'express';
import path from 'path';
import __dirname from './utils.js';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import connectDB from './connection/MongoDB.js';
import { router as productRouter } from './routes/products-router.js';
import { router as cartRouter } from './routes/cart-router.js';
import { router as vistasRouter } from './routes/vistas.router.js';
import socketChat from './socket/socketChat.js';
import socketProducts from './socket/socketProducts.js';
import dotenv from 'dotenv';
dotenv.config();
const port = 8080;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/views'));

app.use(express.static(path.join(__dirname, '/public')));

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/', vistasRouter);
app.use('/', (req, res) => {
  res.setHeader('Content-Type', 'text/plain');
  res.status(200).send('Correcto');
});

const serverHTTP = app.listen(port, () =>
  console.log(`Server encendido en http://localhost:${port}`)
);
serverHTTP.on('error', (err) => console.log(err));

const socketServer = new Server(serverHTTP);

socketProducts(socketServer);
socketChat(socketServer);
