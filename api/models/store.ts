import { Schema, model } from 'mongoose';

import { IStore } from '../../src/app/app-stores/outlet.store';
const schema = new Schema<IStore>({
  name: { type: String, lowercase: true },
  stock_taking: String,
});
export const StoreModel = model('Store', schema);
