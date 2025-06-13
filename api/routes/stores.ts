import Express from 'express';
import { StoreModel } from '../models/store';
import { ProductModel } from '../models/product';
import { Product } from '../../src/app/interfaces/product';
import { InventoryModel } from '../models/inventory';
// import { DBUTILS } from './db.utils';

const router = Express.Router();
router.get('', async (req, res) => {
  const items = await StoreModel.find();
  res.send(items);
});
router.post('/create', async (req, res) => {
  const [item, products] = await Promise.all([
    StoreModel.create(req.body),
    ProductModel.find(),
  ]);
  for (let product of products) {
    await InventoryModel.create({
      store: item._id,
      product: product._id,
      prices: product.units.map((p: any) => {
        return { unit: p.name, value: 1 };
      }),
      quantity: 0,
    });
  }
  res.send({ result: item, status: true });
});
router.post('/createmany', async (req, res) => {
  const [stores, products]: [any, any[]] = await Promise.all([
    StoreModel.create(req.body),
    ProductModel.find(),
  ]);
  for (let store of stores) {
    for (let product of products) {
      await InventoryModel.create({
        store: store._id,
        product: product._id,
        prices: product.units.map((p: any) => {
          return { unit: p.name, value: 1 };
        }),
        quantity: 0,
      });
    }
  }
  res.send({ result: stores, status: true });
});

export default router;
