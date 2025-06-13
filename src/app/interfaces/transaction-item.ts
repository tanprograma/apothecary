import { Product } from './product';

export interface TransactionItem {
  product: string | Product;
  quantity: number;
  received?: number;
  unit: string;
  unit_value: number;
  price?: number;
  date?: string;
  discount?: number;
  category?: string;
}
