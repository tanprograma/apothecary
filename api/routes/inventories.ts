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
router.patch('/restore', async (req, res) => {
  const inventories = await InventoryModel.find();
  for (let item of inventories) {
    item.sales = { items: 0, quantity: 0, amount: 0 };
    item.purchases = { items: 0, quantity: 0, amount: 0 };
    item.receive = { items: 0, quantity: 0, amount: 0 };
    item.issue = { items: 0, quantity: 0, amount: 0 };
    await item.save();
  }
  const newInventories = await InventoryModel.find();
  res.send(newInventories);
});
router.patch('/change-sales-info', async (req, res) => {
  // initializing sales info
  const { store, product, sales } = req.body;
  const inventory = await InventoryModel.findOne({ store, product });
  if (!!inventory) {
    inventory.sales = {
      items: sales.items + inventory.sales.items,
      amount: sales.amount + inventory.sales.amount,
      quantity: sales.quantity + inventory.sales.quantity,
    };
    await inventory.save();
  }
  res.send(inventory);
});
export default router;
