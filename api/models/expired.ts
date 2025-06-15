import { Schema, model } from 'mongoose';
import { Expiry } from '../../src/app/app-stores/expiry.store';

const schema = new Schema<Expiry<string, string>>({
  store: String,
  quantity: Number,
  unit: String,
  unit_value: Number,
  price: Number,
  product: String,
  expiry: String,
  destroyed: Boolean,
});
export const ExpiredModel = model('Expired', schema);
