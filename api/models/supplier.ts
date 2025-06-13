import { Schema, model } from 'mongoose';
import { ISupplier } from '../../src/app/app-stores/supplier.store';

const schema = new Schema<ISupplier>({
  name: { type: String, lowercase: true },
});
export const SupplierModel = model('Supplier', schema);
