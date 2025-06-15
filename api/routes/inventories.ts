import Express from 'express';
import { InventoryModel } from '../models/inventory';
import { StoreModel } from '../models/store';
import { ProductModel } from '../models/product';
import { InventoryUtil } from '../utilities/inventory.util';
const router = Express.Router();
router.get('', async (req, res) => {
  const query = req.query;
  const data = await InventoryUtil.find(
    { ProductModel, StoreModel, InventoryModel },
    query
  );
  res.send(new InventoryUtil(data).summary());
});

router.get('/store/:id', async (req, res) => {
  const query = req.query;
  const data = await InventoryUtil.find(
    { ProductModel, StoreModel, InventoryModel },
    { ...query, store: req.params.id }
  );
  res.send(new InventoryUtil(data).transform());
});
router.patch('/update-price', async (req, res) => {
  const { _id, price } = req.body;
  const inventory = await InventoryModel.findOne({ _id: _id });
  if (!!inventory) {
    inventory.prices = inventory.prices.map(
      (item: { unit: string; value: number }) => {
        // finds the price and changnes its
        if (item.unit == price.unit) {
          item.value = price.value;
          return item;
        }
        return item;
      }
    );
    const result = await inventory.save();
    res.send({ result, status: true });
  } else {
    res.send({ status: true });
  }
});
router.patch('/update-expiry', async (req, res) => {
  const { _id, expiry } = req.body;
  const inventory = await InventoryModel.findOne({ _id: _id });
  if (!!inventory) {
    inventory.expiry = expiry;
    const result = await inventory.save();
    res.send({ result, status: true });
  } else {
    res.send({ status: false });
  }
});

router.patch('/update-quantity', async (req, res) => {
  const { _id, quantity } = req.body;
  const inventory = await InventoryModel.findOne({ _id: _id });
  if (!!inventory) {
    inventory.quantity = inventory.quantity + quantity;
    const result = await inventory.save();
    res.send({ result, status: true });
  } else {
    res.send({ status: true });
  }
});
export default router;
