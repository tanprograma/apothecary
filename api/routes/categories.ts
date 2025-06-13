import Express from 'express';

import { CategoryModel } from '../models/category';
const router = Express.Router();
router.get('', async (req, res) => {
  const items = await CategoryModel.find();
  res.send(items);
});
router.post('/create', async (req, res) => {
  const item = await CategoryModel.create(req.body);
  res.send({ result: item, status: true });
});
router.post('/createmany', async (req, res) => {
  const items = await CategoryModel.create(req.body);
  res.send({ result: items, status: true });
});

export default router;
