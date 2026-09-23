import { Schema, model } from 'mongoose';

import { TransactionItem } from '../../src/app/interfaces/transaction-item';

import { Purchase } from '../../src/app/interfaces/purchase';
import {
  IPurchase,
  IPurchaseItem,
} from '../../src/app/app-stores/purchases.store';
const productSchema = new Schema<IPurchaseItem>(
  {
    product: String,
    requested: Number,

    unit: String,
    unit_value: Number,
    received: Number,
    price: Number,
  },
  { _id: false }
);
const schema = new Schema<IPurchase>(
  {
    source: String,
    destination: String,
    products: [productSchema],
    completed: Boolean,
  },
  { timestamps: true }
);

export const PurchaseModel = model('Purchase', schema);
