import type {CartItem, Product} from '../../../shared/types';

export interface Store {
  authenticated: boolean;
  loading: boolean;
  error: string;
  goods: Product[];
  items: CartItem[];
  login: (login: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setQuantity: (id: string, quantity: number) => void;
  remove: (ids: string[]) => void;
  clear: () => void;
}
