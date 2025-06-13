import { Schema, model } from 'mongoose';
import { Product } from '../../src/app/interfaces/product';
const unitSchema = new Schema<{ name: string; value: number }>(
  {
    name: String,
    value: Number,
  },
  { _id: false }
);
const schema = new Schema<Product>({
  name: { type: String, lowercase: true },
  units: [unitSchema],
  category: String,
});
export const ProductModel = model('Product', schema);
