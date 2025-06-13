import Express from 'express';
import { ProductModel } from '../models/product';
import { StoreModel } from '../models/store';
import { InventoryModel } from '../models/inventory';
// import { DBUTILS } from './db.utils';

const router = Express.Router();
router.get('', async (req, res) => {
  const items = await ProductModel.find();
  res.send(items);
});
router.post('/create', async (req, res) => {
  const [item, stores] = await Promise.all([
    ProductModel.create(req.body),
    StoreModel.find(),
  ]);
  // createInventories
  for (let store of stores) {
    await InventoryModel.create({
      store: store._id,
      product: item._id,
      prices: item.units.map((p: any) => {
        return { unit: p.name, value: 1 };
      }),
      quantity: 0,
    });
  }

  res.send({ result: item, status: true });
});
router.post('/createmany', async (req, res) => {
  const [items, stores]: [any, any[]] = await Promise.all([
    ProductModel.create(req.body),
    StoreModel.find(),
  ]);
  // create an inventory in each store
  for (let item of items) {
    for (let store of stores) {
      await InventoryModel.create({
        store: store._id,
        product: item._id,
        prices: item.units.map((p: any) => {
          return { unit: p.name, value: 1 };
        }),
        quantity: 0,
      });
    }
  }
  res.send({ result: items, status: true });
});

export default router;
