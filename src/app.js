import express from 'express';
import { __dirname } from './utils.js';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import errorRouter from './routes/error.router.js';

const app = express();

const PORT = 8080;

const server = app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

app.use(express.json());
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', errorRouter);