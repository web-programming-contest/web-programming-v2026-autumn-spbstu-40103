import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

export class JsonStorage {
  constructor(readonly directory: string) {}

  async read<T>(fileName: string): Promise<T> {
    const contents = await readFile(resolve(this.directory, fileName), 'utf8');
    return JSON.parse(contents) as T;
  }

  path(fileName: string) {
    return resolve(this.directory, fileName);
  }
}
