import { Customer } from './customer';
import { Store } from './store';
import { TransactionItem } from './transaction-item';

export interface Sale {
  _id?: string;
  store: string | Store;
  customer?: string | Customer;
  createdAt?: string;
  updatedAt?: string;
  products: TransactionItem[];
  discount: number;
}
// export interface SaleItem {

//   store: string
//   customer?: string
//   createdAt?: string;
//   updatedAt?: string;
//   products: TransactionItem[];
//   discount: number;
// }
