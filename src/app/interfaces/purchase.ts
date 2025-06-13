import { Product } from './product';
import { Store } from './store';
import { Supplier } from './supplier';
import { TransactionItem } from './transaction-item';

export interface Purchase {
  _id?: string;
  destination: string | Store;
  supplier: string | Supplier;
  createdAt?: string;
  updatedAt?: string;
  products: TransactionItem[];
  completed?: boolean;
}
