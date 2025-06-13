import { Schema, model } from 'mongoose';
import { Unit } from '../../src/app/interfaces/unit';
const schema = new Schema<Unit>({
  name: { type: String, lowercase: true },
});
export const UnitModel = model('Unit', schema);
