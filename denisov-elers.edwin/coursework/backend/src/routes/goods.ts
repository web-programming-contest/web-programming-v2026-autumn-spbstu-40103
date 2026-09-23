import {Router} from 'express';
import type {Product} from '../../../shared/types.js';
import type {JsonStorage} from '../data/jsonStorage.js';

export function createGoodsRouter(storage: JsonStorage) {
  // eslint-disable-next-line new-cap
  const router = Router();

  router.get('/goods', async (_req, res) => {
    res.json(await storage.read<Product[]>('goods.json'));
  });

  return router;
}
