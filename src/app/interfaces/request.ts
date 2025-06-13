import { Store } from './store';
import { TransactionItem } from './transaction-item';

export interface Transfer {
  _id?: string;
  store: string | Store;
  destination: string | Store;
  createdAt?: string;
  updatedAt?: string;
  products: TransactionItem[];
  completed: boolean;
}
