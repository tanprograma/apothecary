import { Schema, model } from 'mongoose';
import { User } from '../../src/app/interfaces/user';
const schema = new Schema<User>({
  firstname: String,
  lastname: String,
  email: { type: String, lowercase: true },
  password: String,
  role: String,
});
export const UserModel = model('User', schema);
