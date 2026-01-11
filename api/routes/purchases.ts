import Express from 'express';

import { PurchaseModel } from '../models/purchase';
import { ProductModel } from '../models/product';

import { PurchaseUtil } from '../utilities/purchase.util';
import { InventoryModel, purchase } from '../models/inventory';

import { SummaryStats } from '../utilities/statistics.util';
const router = Express.Router();
router.get('', async (req, res) => {
  const { storeID } = req.query;

  try {
    const [inventories, products] = await Promise.all([
      !!storeID
        ? InventoryModel.find({ store: storeID })
        : InventoryModel.find(),
      ProductModel.find(),
    ]);

    res.send(new SummaryStats(products, inventories).purchaseSummary);
  } catch (error) {
    res.send([]);
  }
});
router.get('/query', async (req, res) => {
  // returns data with populated store and product
  try {
    const { start, end } = req.query;
    console.log({ start, end });
    const requests = await PurchaseModel.find({
      createdAt: { $gte: start, $lte: end },
    })
      .sort({ createdAt: -1 })
      .populate([
        { path: 'source' },
        { path: 'destination' },
        { path: 'products.product' },
      ])
      .select('source destination products createdAt completed');

    res.send(requests);
  } catch (error) {
    console.log((error as { message: string }).message);
    res.send([]);
  }
});
router.get('/store/:id', async (req, res) => {
  const query = req.query;
  const { id } = req.params;
  console.log('store id', id);
  const data = await PurchaseUtil.find(
    { PurchaseModel },
    { ...query, store: id }
  );
  const util = new PurchaseUtil(data);

  res.send(util.transform());
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
      transaction['products'] = products;
      transaction['completed'] = true;
      await transaction.save();
      // // one liner to save purchase info
      // await addPurchaseInfo(transaction)
      //
      for (let item of products) {
        await purchase(item, transaction['destination']);
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
router.get('/fix/:requestID', async (req, res) => {
  // one time solution to my save Blunder
  const id = req.params.requestID;

  try {
    const transaction = (await PurchaseModel.findOne({ _id: id })) as any;
    if (!!transaction) {
      transaction['products'] = transaction['products'].map((item: any) => {
        return { ...item, received: item.requested };
      });
      transaction.completed = true;
      const newTransaction = await transaction.save();
      // // one liner to save purchase info

      res.send(newTransaction);
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
router.post('/migrate', async (req, res) => {
  const transaction = (await PurchaseModel.create(req.body)) as any;
  if (!!transaction['completed']) {
    for (let item of transaction['products']) {
      await purchase(item, transaction['destination'], true);
    }
  }

  // await addSalesInfo(sale, true);
  res.send(transaction);
});
router.post('/createmany', async (req, res) => {
  const purchases = await PurchaseModel.create(req.body);

  res.send({
    status: true,
    payload: purchases,
  });
});
export default router;
