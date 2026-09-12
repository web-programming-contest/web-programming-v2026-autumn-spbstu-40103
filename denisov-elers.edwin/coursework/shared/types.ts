export interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  popularity: number;
  createdAt: string;
  category: string;
  color: string;
  image: string;
  description: string;
  characteristics: Record<string, string>;
  isNew: boolean;
  isHit: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Checkout {
  email: string;
  phone: string;
  delivery: 'pickup' | 'delivery';
  address: string;
  payment: 'card' | 'cash';
  packaging: boolean;
}

export interface Order extends Checkout {
  id: string;
  createdAt: string;
  items: (CartItem & {name: string; price: number})[];
  total: number;
}
