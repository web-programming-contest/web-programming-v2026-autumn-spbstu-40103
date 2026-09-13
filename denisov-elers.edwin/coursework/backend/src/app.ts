import {resolve} from 'node:path';
import cors from 'cors';
import express from 'express';
import {JsonStorage} from './data/jsonStorage.js';
import {OrderRepository} from './data/orderRepository.js';
import {errorHandler} from './middleware/errorHandler.js';
import {createAuthRouter} from './routes/auth.js';
import {createGoodsRouter} from './routes/goods.js';
import {createOrdersRouter} from './routes/orders.js';
import {createSessionMiddleware} from './session.js';

export function createApp(dataDir = resolve(process.cwd(), 'data')) {
  const app = express();
  const storage = new JsonStorage(dataDir);
  const orders = new OrderRepository(storage);

  app.use(cors({origin: 'http://localhost:3000', credentials: true}));
  app.use(express.json({limit: '100kb'}));
  app.use(createSessionMiddleware());
  app.use(createAuthRouter(storage));
  app.use(createGoodsRouter(storage));
  app.use(createOrdersRouter(storage, orders));
  app.use(errorHandler);

  return app;
}
