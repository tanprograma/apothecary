import { Schema, model } from 'mongoose';

import {
  IRequest,
  IRequestItem,
} from '../../src/app/app-stores/transfers.store';
const productSchema = new Schema<IRequestItem>(
  {
    product: String,
    requested: Number,
    unit: String,
    unit_value: Number,
    received: Number,
  },
  { _id: false }
);
const schema = new Schema<IRequest>(
  {
    source: String,
    destination: String,
    products: [productSchema],
    completed: Boolean,
  },
  { timestamps: true }
);
export const RequestModel = model('Request', schema);
