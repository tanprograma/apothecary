import { Schema, model } from 'mongoose';

import { Category } from '../../src/app/interfaces/category';
const schema = new Schema<Category>({
  name: { type: String, lowercase: true },
});
export const CategoryModel = model('Category', schema);
