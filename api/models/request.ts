import mongoose, { Schema, model } from 'mongoose';

import {
  IRequest,
  IRequestItem,
} from '../../src/app/app-stores/transfers.store';
const productSchema = new Schema<any>(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    requested: Number,
    unit: String,
    unit_value: Number,
    received: Number,
    price: Number,
  },
  { _id: false }
);
const schema = new Schema<any>(
  {
    source: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
    destination: { type: mongoose.Schema.Types.ObjectId, ref: 'Store' },
    products: [productSchema],
    completed: Boolean,
  },
  { timestamps: true }
);
export const RequestModel = model('Request', schema);
