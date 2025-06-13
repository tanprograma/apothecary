import Express from 'express';
import { UnitModel } from '../models/unit';
const router = Express.Router();
router.get('', async (req, res) => {
  const items = await UnitModel.find();
  res.send(items);
});
router.post('/create', async (req, res) => {
  const item = await UnitModel.create(req.body);
  res.send({ result: item, status: true });
});
router.post('/createmany', async (req, res) => {
  const items = await UnitModel.create(req.body);
  res.send({ result: items, status: true });
});

export default router;
