import Express from 'express';
import { ExpiredModel } from '../models/expired';
import { ProductModel } from '../models/product';
import { StoreModel } from '../models/store';
import { ExpiryUtil } from '../utilities/expiry.util';
const router = Express.Router();
router.get('', async (req, res) => {
  try {
    const data = await ExpiryUtil.find(
      { ProductModel, StoreModel, ExpiredModel },
      req.query
    );
    res.send(new ExpiryUtil(data).transform());
  } catch (error) {
    res.send([]);
  }
});
router.post('/create', async (req, res) => {
  const item = await ExpiredModel.create(req.body);

  res.send({ result: item, status: true });
});
router.post('/createmany', async (req, res) => {
  const items = await ExpiredModel.create(req.body);

  res.send({ result: items, status: true });
});

export default router;
