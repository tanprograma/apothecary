import { Schema, model } from 'mongoose';

import { Store } from '../../src/app/interfaces/store';
const schema = new Schema<Store>({
  name: { type: String, lowercase: true },
});
export const StoreModel = model('Store', schema);
