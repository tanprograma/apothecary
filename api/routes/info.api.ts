import Express from 'express';
import { InfoModel } from '../models/info.model';
const router = Express.Router();
router.get('', async (req, res) => {
  const info = await InfoModel.find();
  res.send(info);
});
router.post('/initialize', async (req, res) => {
  const item = await InfoModel.create(req.body);
  res.send({ result: item, status: true });
});

export default router;
