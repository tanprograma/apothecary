import Express from 'express';

import { SupplierModel } from '../models/supplier';

const router = Express.Router();
router.get('', async (req, res) => {
  const items = await SupplierModel.find();
  res.send(items);
});
router.post('/create', async (req, res) => {
  const item = await SupplierModel.create(req.body);

  res.send({ result: item, status: true });
});
router.post('/createmany', async (req, res) => {
  const items = await SupplierModel.create(req.body);

  res.send({ result: items, status: true });
});

export default router;
