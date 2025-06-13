import { Schema, model } from 'mongoose';
import { Log } from '../../src/app/app-stores/logs.store';

const schema = new Schema<Log>(
  {
    message: { type: String, lowercase: true },
  },
  { timestamps: true }
);
export const LogModel = model('Log', schema);
