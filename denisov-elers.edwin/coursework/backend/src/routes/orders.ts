import {Router} from 'express';
import type {Product} from '../../../shared/types.js';
import type {JsonStorage} from '../data/jsonStorage.js';
import type {OrderRepository} from '../data/orderRepository.js';
import {createOrder, type OrderRequest} from '../domain/order.js';
import {requireAuthentication} from '../middleware/requireAuthentication.js';

export function createOrdersRouter(
  storage: JsonStorage,
  orders: OrderRepository,
) {
  // eslint-disable-next-line new-cap
  const router = Router();
  router.use('/orders', requireAuthentication);

  router.get('/orders', async (_req, res) => {
    res.json((await orders.list()).reverse());
  });

  router.post('/orders', async (req, res) => {
    const goods = await storage.read<Product[]>('goods.json');
    const order = createOrder(req.body as OrderRequest | undefined, goods);
    await orders.add(order);
    res.status(201).json(order);
  });

  return router;
}
