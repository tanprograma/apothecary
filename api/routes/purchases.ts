import Express from 'express';

import { PurchaseModel } from '../models/purchase';
import { ProductModel } from '../models/product';

import { StoreModel } from '../models/store';
import { SupplierModel } from '../models/supplier';
import { PurchaseUtil } from '../utilities/purchase.util';
import { purchase } from '../models/inventory';
const router = Express.Router();
router.get('', async (req, res) => {
  const query = req.query;
  const data = await PurchaseUtil.find(
    { ProductModel, StoreModel, SupplierModel, PurchaseModel },
    query
  );
  res.send(new PurchaseUtil(data).summary());
});
router.get('/store/:id', async (req, res) => {
  const query = req.query;
  const { id } = req.params;

  const data = await PurchaseUtil.find(
    { ProductModel, StoreModel, PurchaseModel, SupplierModel },
    { ...query, store: id }
  );

  res.send(new PurchaseUtil(data).transform());
});
router.post('/create', async (req, res) => {
  const purchase = await PurchaseModel.create(req.body);

  res.send({
    status: true,
    result: purchase,
  });
});
router.patch('/receive/:requestID', async (req, res) => {
  const id = req.params.requestID;
  const { products } = req.body;
  try {
    const transaction = await PurchaseModel.findOne({ _id: id });
    if (!!transaction) {
      transaction.products = products;
      transaction.completed = true;
      await transaction.save();
      for (let item of products) {
        await purchase(item, transaction.destination);
      }
      res.send({ status: true });
    } else {
      res.send({ status: false });
    }
  } catch (error) {
    console.log((error as { message: string }).message);
    res.send({ status: false });
  }
});
// router.patch('/complete/:requestID', async (req, res) => {
//   const id = req.params.requestID;
//   const item = await PurchaseModel.findOne({ _id: id });
//   item.completed = true;
//   const result = await item.save();
//   res.send({ status: true, result: result });
// });
router.post('/createmany', async (req, res) => {
  const purchases = await PurchaseModel.create(req.body);

  res.send({
    status: true,
    payload: purchases,
  });
});
export default router;
