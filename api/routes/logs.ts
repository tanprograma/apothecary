import Express from 'express';
import { LogModel } from '../models/logs.model';
import { Log } from '../../src/app/app-stores/logs.store';
const router = Express.Router();
router.get('', async (req, res) => {
  const items = await LogModel.find();
  res.send(items);
});
router.post('/create', async (req, res) => {
  const item = await LogModel.create(req.body);
  res.send({ result: item, status: true });
});
router.post('/createmany', async (req, res) => {
  const items = await LogModel.create(req.body);
  res.send({ result: items, status: true });
});
export async function log(content: Partial<Log>) {
  await LogModel.create(content);
}

export default router;
