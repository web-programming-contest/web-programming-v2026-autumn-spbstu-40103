import {rename, writeFile} from 'node:fs/promises';
import type {Order} from '../../../shared/types.js';
import {JsonStorage} from './jsonStorage.js';

export class OrderRepository {
  private pendingWrite = Promise.resolve();

  constructor(private readonly storage: JsonStorage) {}

  async list(): Promise<Order[]> {
    return this.storage.read<Order[]>('orders.json');
  }

  async add(order: Order): Promise<void> {
    const save = this.pendingWrite.then(async () => {
      const orders = await this.list();
      orders.push(order);

      const temporaryPath = this.storage.path('orders.json.tmp');
      await writeFile(temporaryPath, `${JSON.stringify(orders, null, 2)}\n`);
      await rename(temporaryPath, this.storage.path('orders.json'));
    });

    this.pendingWrite = save.catch(() => {});
    await save;
  }
}
